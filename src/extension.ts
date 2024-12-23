import * as vscode from 'vscode';
import { CommandRegistrar } from './commands/CommandRegistrar';
import { ProvideRegistrar, ShowModelsProvider } from './providers';

/**
 * This method is called when your extension is activated
 * Your extension is activated the very first time the command is executed
 * @param context: vscode.ExtensionContext
*/
export async function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, EC Code Assist" is now active!');

	initializeDataProviders(context);

	// Register the command events for the extension
	const commandRegistrar = new CommandRegistrar();
	commandRegistrar.registerCommandEvents(context);
}

/**
 * Initialize the data providers for the extension
 */
function initializeDataProviders(context: vscode.ExtensionContext): void {

	const providerRegistrar = new ProvideRegistrar(context);
	
	// Initialize the data provider for the models tree view
	const showModelsProvider = new ShowModelsProvider(context);
	providerRegistrar.registerModelTreeProvider(showModelsProvider);
}



// This method is called when your extension is deactivated
export function deactivate() { }




