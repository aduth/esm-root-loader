import { expect } from 'chai';
import { isSkippedDefaultResolved, isBareImport } from '../index.js';

describe('isSkippedDefaultResolved', () => {
	it('returns false for undefined result', () => {
		const result = isSkippedDefaultResolved(undefined);

		expect(result).to.be.false;
	});

	it('returns true for node_modules resolve result', () => {
		const result = isSkippedDefaultResolved({
			url: new URL('node_modules', import.meta.url).toString(),
		});

		expect(result).to.be.true;
	});

	it('returns false for non-node_modules context', () => {
		const result = isSkippedDefaultResolved({
			url: new URL(import.meta.url).toString(),
		});

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
