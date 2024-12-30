import * as vscode from 'vscode';
import { CommandRegistrar } from './commands/CommandRegistrar';
import { ProviderBuilder } from './providers';

/**
 * This method is called when your extension is activated
 * Your extension is activated the very first time the command is executed
 * @param context: vscode.ExtensionContext
*/
export async function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, EC Code Assist" is now active!');

	// registering providers for the extension
	const providerBuilder: ProviderBuilder = new ProviderBuilder(context);
	providerBuilder.buildProviders();

	// Register the command events for the extension
	const commandRegistrar = new CommandRegistrar();
	commandRegistrar.registerCommandEvents(context);
}


/** 
 * Called when the extension is deactivated
 */
export function deactivate(): void { }




