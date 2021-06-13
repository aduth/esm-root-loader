/**
 * External dependencies
 */
import { promises as fsPromises } from 'fs';
import { join } from 'path';

/**
 * Cached root value.
 *
 * @type {string|void}
 */
let root;

/**
 * Returns a promise resolving to the path to use as root, using `esmRoot`
 * property from the relative `package.json`, if defined, or `process.cwd`
 * otherwise.
 *
 * @return {Promise<string>} Module root path.
 */
async function getRoot() {
	if (!root) {
		const pkgFile = join(process.cwd(), 'package.json');
		root = process.cwd();
		try {
			/** @type {Object<string,string>} */
			const pkg = JSON.parse(await fsPromises.readFile(pkgFile, 'utf8'));
			root = join(root, pkg.esmRoot);
		} catch {}
	}

	return root;
}

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
export async function resolve(specifier, parentModule, defaultResolver) {
	// Resolve root path imports from current working directory.
	specifier = specifier.replace(/^\//, join(await getRoot(), '/'));

	return defaultResolver(specifier, parentModule);
}
