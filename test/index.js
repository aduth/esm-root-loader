import { expect } from 'chai';
import { isSkippedContext, isBareImport } from '../index.js';

describe('isSkippedContext', () => {
	it('returns true for node_modules context', () => {
		const result = isSkippedContext({
			parentURL: new URL('node_modules', import.meta.url),
		});

		expect(result).to.be.true;
	});

	it('returns false for non-node_modules context', () => {
		const result = isSkippedContext({ parentURL: new URL(import.meta.url) });

		expect(result).to.be.false;
	});
});

describe('isBareImport', () => {
	it('returns true for bare import', () => {
		const result = isBareImport('esbuild-esm-loader');

		expect(result).to.be.true;
	});

	it('returns false for same-directory import', () => {
		const result = isBareImport('./foo');

		expect(result).to.be.false;
	});

	it('returns false for parent-directory import', () => {
		const result = isBareImport('../foo');

		expect(result).to.be.false;
	});

	it('returns false for file: import', () => {
		const result = isBareImport('file:foo');

		expect(result).to.be.false;
	});

	it('returns false for data: import', () => {
		const result = isBareImport('data:foo');

		expect(result).to.be.false;
	});

	it('returns false for node: import', () => {
		const result = isBareImport('node:foo');

		expect(result).to.be.false;
	});
});
