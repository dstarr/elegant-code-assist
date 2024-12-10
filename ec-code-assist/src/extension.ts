import * as vscode from 'vscode';
import { CommandRegistrar } from './commands/CommandRegistrar';
import { ShowModelsProvider } from './providers';

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
	
	const showModelsProvider: ShowModelsProvider = new ShowModelsProvider();

	vscode.window.registerTreeDataProvider('ec_assist_modelsView', showModelsProvider);
	
	vscode.window.createTreeView('ec_assist_modelsView', {
		treeDataProvider: showModelsProvider,
		canSelectMany: false
	});
}

// This method is called when your extension is deactivated
export function deactivate() { }




