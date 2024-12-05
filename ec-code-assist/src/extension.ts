// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CommandRegistrar } from './commands/CommandRegistrar';
import { SelectedCodeViewProvider } from './views/SelectedCodeViewProvider';

/**
 * This method is called when your extension is activated
 * Your extension is activated the very first time the command is executed
 * @param context: vscode.ExtensionContext
 */
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, EC Code Assist" is now active!');

	// Create the webview panel
	const provider = new SelectedCodeViewProvider(context.extensionUri);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(SelectedCodeViewProvider.viewType, provider));

	// Register the command events for the extension
	let commandRegistrar = new CommandRegistrar();
	commandRegistrar.registerCommandEvents(context, provider);

}

// This method is called when your extension is deactivated
export function deactivate() { }