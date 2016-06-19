import test from 'ava';
import shell from 'shelljs';
import m from './';

shell.config.silent = true;

test('mock and unmock git', async t => {
	const log = 'mocking git!';
	const unmock = await m('git', '#!/usr/bin/env node', `console.log('${log}')`);
	let actual = shell.exec('git').stdout;
	t.is(log + '\n', actual);

	unmock();
	actual = shell.exec('git').stdout;
	t.not(log + '\n', actual);
});

test('environment', async t => {
	const log = 'mocking git!';
	await m('git', 'node', `console.log('${log}')`);
	const actual = shell.exec('git').stdout;

	t.is(log + '\n', actual);
});
