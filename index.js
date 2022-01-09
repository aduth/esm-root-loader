import { readFileSync } from 'fs';
import { join } from 'path';

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
 * Returns a promise which resolves to the resolved file path for a given module
 * specifier and parent file. Overrides the default resolver behavior to allow
 * for root path imports as from the current working directory.
 *
 * @see https://nodejs.org/api/esm.html#esm_resolve_hook
 *
 * @param {string}   specifier       Imported module specifier.
 * @param {string}   parentModule    Parent file URL.
 * @param {Function} defaultResolver Default resolver implementation.
 *
 * @return {Promise<string>} Resolved file path.
 */
export function resolve(specifier, parentModule, defaultResolver) {
	let revisedSpecifier;
	if (!rootPrefix) {
		revisedSpecifier = specifier;
	} else if (specifier.startsWith(rootPrefix)) {
		revisedSpecifier = specifier.slice(0 + rootPrefix.length);
	}

	if (revisedSpecifier) {
		try {
			return defaultResolver(join(root, revisedSpecifier), parentModule);
		} catch {}
	}

	return defaultResolver(specifier, parentModule);
}
