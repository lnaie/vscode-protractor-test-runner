'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as runner from './commands/protractor-runner';

// This method is called when the extension is activated.
// The extension is activated the very first time the command is executed.
export function activate(context: vscode.ExtensionContext) {
    // Register a new output channel
    var commandOutput = vscode.window.createOutputChannel('ProtractorTestRunnerLog');
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
        runner.execute(filePath, commandOutput);
    });
    context.subscriptions.push(protractorTestRunnerDisposable);

    // Register protractorTestRunnerLog cmd
    let protractorTestRunnerLogDisposable = vscode.commands.registerCommand('extension.protractorTestRunnerLog', () => {
        commandOutput.show();
    })
    context.subscriptions.push(protractorTestRunnerLogDisposable);
}

// This method is called when the extension is deactivated
export function deactivate() {
    runner.killActiveProcess();
}