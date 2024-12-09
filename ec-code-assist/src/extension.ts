// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CommandRegistrar } from './commands/CommandRegistrar';
import { PlaceholderDataProvider, ShowModelsProvider } from './providers';

/**
 * This method is called when your extension is activated
 * Your extension is activated the very first time the command is executed
 * @param context: vscode.ExtensionContext
*/
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, EC Code Assist" is now active!');

	initializeDataProviders(context);
	
	// Register the command events for the extension
	const commandRegistrar = new CommandRegistrar();
	commandRegistrar.registerCommandEvents(context);
}

/**
 * Initialize the data providers for the extension
 */
function initializeDataProviders(context: vscode.ExtensionContext) {
	
	const showModelsProvider = new ShowModelsProvider();

	vscode.window.createTreeView('ec_assist_modelsView', {
		treeDataProvider: showModelsProvider,
		canSelectMany: false
	});

	vscode.window.registerTreeDataProvider('ec_assist_modelsView', showModelsProvider);
	// vscode.commands.executeCommand('setContext', 'ec_assist_showModelsLoaded', true);
}

// This method is called when your extension is deactivated
export function deactivate() { }




