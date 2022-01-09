import { a } from 'a.js';
import '@aduth/eslint-config';
import '@aduth/eslint-config/es5';
import { strict as assert } from 'assert';

a();
assert.equal(typeof assert.equal, 'function');
