import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * @typedef ResolveContext
 *
 * @prop {string[]} conditions
 * @prop {string=} parentURL
 */

/**
 * Cached package.json configuration.
 *
 * @type {object}
 */
let config;

/**
 * Returns the current working directory's package.json manifest as an object.
 *
 * @return {object}
 */
function getConfig() {
	if (!config) {
		try {
			const pkgFile = join(process.cwd(), 'package.json');
			config = JSON.parse(readFileSync(pkgFile, 'utf8'));
		} catch {
			config = {};
		}
	}

	return config;
}

/**
 * Cached root.
 *
 * @type {string}
 */
const root = join(
	process.cwd(),
	process.env.ESM_ROOT ?? getConfig().esmRoot ?? ''
);

/**
 * Root prefix to substitute for specifiers.
 *
 * @type {string|false}
 */
const rootPrefix =
	process.env.ESM_ROOT_PREFIX ?? getConfig().esmRootPrefix ?? '/';

/**
 * Returns true if the import context is skipped, or false otherwise.
 *
 * @param {ResolveContext} context Resolution context.
 *
 * @return {boolean}
 */
export const isSkippedContext = (context) =>
	!!context.parentURL && /node_modules/.test(context.parentURL);

/**
 * Returns true if the given specifier is for a bare import, or false otherwise.
 *
 * @param {string} specifier Specifier to check.
 *
 * @return {boolean} Whether specifier is for a bare import.
 */
export const isBareImport = (specifier) =>
	!/^\.|(file|node|data):/.test(specifier);

/**
 * Returns a promise which resolves to the resolved file path for a given module
 * specifier and parent file. Overrides the default resolver behavior to allow
 * for root path imports as from the current working directory.
 *
 * @see https://nodejs.org/api/esm.html#esm_resolve_hook
 *
 * @param {string} specifier Imported module specifier.
 * @param {ResolveContext} context Resolution context.
 * @param {Function} defaultResolve Default resolver implementation.
 *
 * @return {Promise<string>} Resolved file path.
 */
export function resolve(specifier, context, defaultResolve) {
	if (!isSkippedContext(context) && isBareImport(specifier)) {
		let revisedSpecifier;
		if (!rootPrefix) {
			revisedSpecifier = specifier;
		} else if (specifier.startsWith(rootPrefix)) {
			revisedSpecifier = specifier.slice(0 + rootPrefix.length);
		}

		if (revisedSpecifier) {
			try {
				return defaultResolve(join(root, revisedSpecifier), context);
			} catch {}
		}
	}

	return defaultResolve(specifier, context);
}
