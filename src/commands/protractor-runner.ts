// Based on https://github.com/bbenoist/vscode-shell/blob/master/src/extension.ts
// because it's hard to reuse all that code.
//
import * as vscode from 'vscode';
import * as path from 'path';
var spawnCMD = require('spawn-command');
var treeKill = require('tree-kill');

var process = null;
var commandOutput: vscode.OutputChannel = null;

/**
 * Tries to run one command at a time.
 */
export function execute(filePath: string, outputChannel: vscode.OutputChannel) {
    commandOutput = outputChannel; 

    // Already running one?
    if (process) {
        const msg = 'There is a command running right now. Terminate it before executing a new command?';
        vscode.window
            .showWarningMessage(msg, 'Ok', 'Cancel')
            .then((choice) => {
                if (choice === 'Ok') {
                    killActiveProcess();
                }
            });
        return;
    }

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
}

/**
 * Tries to kill the active process that is running a command.
 */
export function killActiveProcess() {
    if (!process)
        return;

    treeKill(process.pid, 'SIGTERM', (err) => {
        if (err) {
            commandOutput.appendLine(`> ERROR: Failed to kill process with PID ${process.pid}.`);
        }
        else {
            process = null;
        }
    });
}

function printOutputDelegate(data) { 
    commandOutput.append(data.toString());
};

function runShellCommand(cmd:string, cwd:string) {
    return new Promise((accept, reject) => {
        var opts : any = {};
        if (vscode.workspace) {
            opts.cwd = cwd;
        }
        process = spawnCMD(cmd, opts);
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
}