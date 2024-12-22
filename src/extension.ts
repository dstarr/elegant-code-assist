import * as vscode from 'vscode';
import { CommandRegistrar } from './commands/CommandRegistrar';
import { ShowModelsProvider } from './providers';
import { ModelItem } from './providers/ShowModelsProvider';

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
async function initializeDataProviders(context: vscode.ExtensionContext): Promise<void> {

	console.debug('initializeDataProviders');

	const showModelsProvider = new ShowModelsProvider(context);
	const treeView = vscode.window.createTreeView('ec_assist_modelsView', {
		treeDataProvider: showModelsProvider,
		canSelectMany: false
	});

	// Handle visibility changes
	treeView.onDidChangeVisibility(event => {
		console.log('Tree view visibility changed. Visibility: ', event.visible.valueOf());
		if (event.visible) {
			showModelsProvider.refresh();
		}
	});

	// Handle element expansion
	treeView.onDidExpandElement(event => {
		console.log('Element expanded:', event.element);
	});

	// Handle element collapse
	treeView.onDidCollapseElement(event => {
		console.log('Element collapsed:', event.element);
	});

	treeView.onDidChangeSelection( (event) => {

		if(event.selection.length < 0) {
			return;
		}
		
		console.debug('onDidChangeSelectionL ', event.selection[0].label);

		const selectedItem = event.selection[0];
		if (event.selection.length > 0) {
            const selectedItem = event.selection[0] as ModelItem;
            context.workspaceState.update('ec_assist.activeModel', selectedItem.name)
				.then(() => {
					showModelsProvider.updateIconPathForSelectedItem(selectedItem);
				});
        }




		// Update the active model in the workspace state
		return new Promise<void>((resolve, reject) => {
			const modelItem = selectedItem as ModelItem;
			context.workspaceState.update('ec_assist.activeModel', modelItem.name);
			resolve();
		});


		
	});
}



// This method is called when your extension is deactivated
export function deactivate() { }




