'use strict';
var shell = require('shelljs');
var tempWrite = require('temp-write');
var shebangRegex = require('shebang-regex');

module.exports = function (bin, shebang, code) {
	if (!shebangRegex.test(shebang)) {
		shebang = '#!/usr/bin/env ' + shebang;
	}

	var oldPath = shell.env.PATH;

	var ret = tempWrite(shebang + '\n' + code, bin)
		.then(function (filepath) {
			shell.chmod('+x', filepath);
			shell.env.PATH = filepath.replace(new RegExp(bin + '$'), '') + ':' + oldPath;

			return function () {
				if (oldPath) {
					shell.env.PATH = oldPath;
					oldPath = null;
				}
			};
		});

	return ret;
};
