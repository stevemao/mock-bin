'use strict';
const shell = require('shelljs');
const tempWrite = require('temp-write');
const shebangRegex = require('shebang-regex');
const cmdShim = require('cmd-shim');
const pify = require('pify');

module.exports = (bin, shebang, code) => {
	if (!shebangRegex.test(shebang)) {
		shebang = '#!/usr/bin/env ' + shebang;
	}

	// On windows shebangs aren't supported. Use a fake extension to prevent
	// the bin from being executed instead of the shim.
	const fileName = bin + (process.platform === 'win32' ? '.x-mock-bin' : '');

	let oldPath = shell.env.PATH;

	return tempWrite(shebang + '\n' + code, fileName)
		.then(filepath => {
			// Path separator according to platform
			const sep = process.platform === 'win32' ? ';' : ':';
			shell.chmod('+x', filepath);
			shell.env.PATH = filepath.replace(new RegExp(fileName + '$'), '') + sep + oldPath;

			if (process.platform === 'win32') {
				// On windows shebangs aren't supported, add cmd shim
				return pify(cmdShim)(filepath, filepath.replace(new RegExp('\\.x-mock-bin$'), ''));
			}
		})
		.then(() => () => {
			if (oldPath) {
				shell.env.PATH = oldPath;
				oldPath = null;
			}
		});
};
