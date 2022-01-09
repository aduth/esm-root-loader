# ESM Root Loader

**ESM Root Loader** is a custom resolver implementation for the [experimental loader hooks](https://nodejs.org/dist/latest-v12.x/docs/api/esm.html#esm_experimental_loader_hooks) feature of Node.js ECMAScript modules.

Using this loader will enhance the default loader behavior to allow you to import from the root of your project, even if the import occurs from a file located in a subdirectory:

```js
import config from '/config.js';
```

By default, the above code snippet will resolve a `config.js` file from the root of your project.

This can be especially useful in projects which run both in the browser and in Node.js, since browser imports on the root path can be leveraged to resolve from the root of a domain.

## Installation

Install as a dependency using `npm`:

```
npm install esm-root-loader
```

## Usage

Loaders can be defined as an argument when running `node`.

```
node --experimental-loader=esm-root-loader entry.js
```

## Configuration

Default usage will resolve imports from the root of your project.

If needed, you can assign a custom root path using an `esmRoot` property in your project's `package.json`. This will be evaluated as relative to the root path of the project.

```json
{
	"esmRoot": "./public"
}
```

You can also customize or omit the prefix for resolving specifiers from the root.

For example, to import without the leading slash, you can set `esmRootPrefix` to `false` in your project's `package.json`.

```js
import config from 'config.js';
```

```json
{
	"esmRootPrefix": false
}
```

You can also customize the prefix by assigning any string value to this property.

```js
import config from '~config.js';
```

```json
{
	"esmRootPrefix": "~"
}
```

These options are also configurable by environment variables `ESM_ROOT` and `ESM_ROOT_PREFIX`.

## Versioning

This project follows [SemVer](https://semver.org/).

To better align with the experimental status of the loader hooks, initial releases will follow major version zero until the feature stabilizes in Node.js. Minor versions on the zero major will always include breaking changes. Patch versions on the zero major will include bug fixes and backwards-compatible changes.

Versioning will proceed from 1.0.0 once the feature stabilizes in Node.js.

## License

Copyright (c) 2019 Andrew Duthie

Released under the MIT License. See [LICENSE.md](./LICENSE.md).
