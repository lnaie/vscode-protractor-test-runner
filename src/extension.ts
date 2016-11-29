'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
var spawnCmd = require('spawn-command');
var treeKill = require('tree-kill');
var process = null;
var commandOutput: vscode.OutputChannel = null;

// This method is called when the extension is activated.
// The extension is activated the very first time the command is executed.
export function activate(context: vscode.ExtensionContext) {
    // Register a new output channel
    commandOutput = vscode.window.createOutputChannel('ProtractorTestRunnerLog');
    context.subscriptions.push(commandOutput);

    // Register protractorTestRunner cmd
    let protractorTestRunnerDisposable = vscode.commands.registerCommand('extension.protractorTestRunner', (fileUri?: vscode.Uri) => {
        let filePath = '';
		if (fileUri && fileUri.fsPath) {
			filePath = fileUri.fsPath;
		}
		else {
			if (!vscode.window.activeTextEditor || !vscode.window.activeTextEditor.document)
				return;

			filePath = vscode.window.activeTextEditor.document.uri.fsPath;
		}

        startProcess(filePath);
    });
    context.subscriptions.push(protractorTestRunnerDisposable);

    // Register protractorTestRunnerLog cmd
    let protractorTestRunnerLogDisposable = vscode.commands.registerCommand('extension.protractorTestRunnerLog', () => {
        commandOutput.show();
    })
    context.subscriptions.push(protractorTestRunnerLogDisposable);
};

// This method is called when the extension is deactivated
export function deactivate() {
    // Clean up
    killActiveProcess();
};

// Tries to run one command at a time.
function startProcess(filePath: string) {
    // Already running one?
    if (process) {
        const msg = 'There is a command running right now. Terminate it before executing a new command?';
        vscode.window.showWarningMessage(msg, 'Ok', 'Cancel')
            .then((choice) => {
                if (choice === 'Ok') {
                    killActiveProcess();
                }
            });
        return;
    }

    // Show log window
    commandOutput.show();

    // Start a new command
    var cmd = `protractor --specs ${filePath}`;
    commandOutput.appendLine(`> Running command: ${cmd}...`);

    runShellCommand(cmd, vscode.workspace.rootPath)
        .then(() => {
            commandOutput.appendLine(`> Command finished successfully.`);
        })
        .catch((reason) => {
            commandOutput.appendLine(`> ERROR: ${reason}`);
        });
};

// Tries to kill the active process that is running a command.
function killActiveProcess() {
    if (!process)
        return;

    commandOutput.appendLine(`> Killing PID ${process.pid}...`);
    treeKill(process.pid, 'SIGTERM', (err) => {
        if (err) {
            commandOutput.appendLine("> ERROR: Failed to kill process.");
        }
        else {
            commandOutput.appendLine("> Process killed.");
            process = null;
        }
    });
};

function printOutputDelegate(data) { 
    commandOutput.append(data.toString());
};

function runShellCommand(cmd:string, cwd:string) {
    return new Promise((accept, reject) => {
        var opts : any = {};
        if (vscode.workspace) {
            opts.cwd = cwd;
        }

        process = spawnCmd(cmd, opts);
        process.stdout.on('data', printOutputDelegate);
        process.stderr.on('data', printOutputDelegate);
        process.on('close', (status) => {
            if (status) {
                reject(`Command exited with status code ${status}.`);
            } else {
                accept();
            }
            process = null;
        });
    });
};
