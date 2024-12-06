// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CommandRegistrar } from './commands/CommandRegistrar';

/**
 * This method is called when your extension is activated
 * Your extension is activated the very first time the command is executed
 * @param context: vscode.ExtensionContext
 */
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, EC Code Assist" is now active!');

	// Register the command events for the extension
	let commandRegistrar = new CommandRegistrar();
	commandRegistrar.registerCommandEvents(context);

}

// This method is called when your extension is deactivated
export function deactivate() { }


