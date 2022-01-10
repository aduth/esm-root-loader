import { a } from 'a.js';
import { b, c } from '@aduth/b';
import { expect } from 'chai';
import '@aduth/eslint-config';
import '@aduth/eslint-config/es5';
import { strict as assert } from 'assert';

a();
b();
c();
assert.equal(typeof assert.equal, 'function');
assert.equal(typeof expect, 'function');
