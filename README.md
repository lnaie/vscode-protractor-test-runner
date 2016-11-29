# Protractor Test Runner

## Description

Protractor Test Runner is a [VS Code][vscode] extension which enables you to right-click on an .e2e.ts file and test it with Protractor.

It assumes you have Protractor installed (http://www.protractortest.org) and the extensions are ran in context of a project that has protractor typescript test files.

## Usage
### Run Protractor Test(s)
* In VS Code project explorer, right click on a .ts or .e2e.ts file and choose option `Protractor: Run test(s)`.
* Press `F1` and select the command with title: `Protractor: Run test(s)`. This will run Protractor on selected typescript file.

### Show Protractor Runner Log
* Press Ctrl+F1 or Cmd+F1 (on Mac) to show the Protractor Runner Log.
* Press `F1` and select the command with title: `Protractor: Show runner log`.

## Installation
Hit `Ctrl+P` and enter the `ext install protractor-test-runner` command. **Warning:** select the extension authored by **lnaie**.

## Issues / Feature requests
You can submit your issues and feature requests on the GitHub [issues page][issues].

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)][license]

## Credits
It contains code from https://github.com/bbenoist/vscode-shell.

[marketplace]: https://marketplace.visualstudio.com/items/lnaie.protractor-test-runner
[gh-repo]: https://github.com/lnaie/vscode-protractor-test-runner
[issues]: https://github.com/lnaie/vscode-protractor-test-runner/issues/
[npm-dependencies]: https://david-dm.org/bbenoist/vscode-shell
[npm-devdependencies]: https://david-dm.org/bbenoist/vscode-shell#info=devDependencies
[license]: https://github.com/lnaie/vscode-protractor-test-runner/master/LICENSE
[vscode]: https://code.visualstudio.com/
