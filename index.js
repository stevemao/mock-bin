'use strict';
var shell = require('shelljs');
var tempWrite = require('temp-write');
var shebangRegex = require('shebang-regex');
var cmdShim = require('cmd-shim');
var Promise = require('pinkie-promise');
var pify = require('pify');

module.exports = function (bin, shebang, code) {
	if (!shebangRegex.test(shebang)) {
		shebang = '#!/usr/bin/env ' + shebang;
	}

	// On windows shebangs aren't supported. Use a fake extension to prevent
	// the bin from being executed instead of the shim.
	var fileName = bin + (process.platform === 'win32' ? '.x-mock-bin' : '');

	var oldPath = shell.env.PATH;

	var ret = tempWrite(shebang + '\n' + code, fileName)
		.then(function (filepath) {
			// Path separator according to platform
			var sep = process.platform === 'win32' ? ';' : ':';
			shell.chmod('+x', filepath);
			shell.env.PATH = filepath.replace(new RegExp(fileName + '$'), '') + sep + oldPath;

			if (process.platform === 'win32') {
				// on windows shebangs aren't supported, add cmd shim
				return pify(cmdShim, Promise)(filepath, filepath.replace(new RegExp('\\.x-mock-bin$'), ''));
			}
		})
		.then(function () {
			return function () {
				if (oldPath) {
					shell.env.PATH = oldPath;
					oldPath = null;
				}
			};
		});

	return ret;
};
