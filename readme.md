# mock-bin [![Build Status](https://travis-ci.org/stevemao/mock-bin.svg?branch=master)](https://travis-ci.org/stevemao/mock-bin)

> Mock any executable binary

Useful for mocking tests that run executable binary, especially to fake edge cases and increase test coverage.


## Install

```
$ npm install --save-dev mock-bin
```


## Usage

```js
const mockBin = require('mock-bin');
const log = 'mocking git!';
const unmock = await mockBin('git', 'node', `console.log('${log}')`);
let actual = shell.exec('git').stdout;
t.is(log + '\n', actual);

unmock();
actual = shell.exec('git').stdout;
t.not(log + '\n', actual);
```


## API

### mockBin(bin, shebang, code)

Returns a promise which resolves with an unmock function.

#### bin

Type: `string`

EG: `'git'`.

#### shebang

Type: `string`

Shebang or environment

EG: `'#!/usr/bin/env node'` or `'bash'`

##### code

Type: `string`  

The actual code you want to execute.


## License

MIT © [Steve Mao](https://github.com/stevemao)
