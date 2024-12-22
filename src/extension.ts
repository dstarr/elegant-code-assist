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
function initializeDataProviders(context: vscode.ExtensionContext) {

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

	treeView.onDidChangeSelection(async (event) => {

		console.debug('onDidChangeSelection');
		console.debug(event.selection);

		// const selectedItems = event.selection;
		// if(selectedItems.length > 0) {
			// 	this._refreshModelsVIew(treeView), event.selection[0];
			
			// if (selectedItems.length > 0) {
				// 	let selectedItem = selectedItems[0];
				// 	context.workspaceState.update('ec-code-assist.activeModel', selectedItem.label)
				// 		.then(() => {
					// 			selectedItem.iconPath = new vscode.ThemeIcon('chat-editor-label-icon');
					// 			showModelsProvider.refresh();
					// 		});
					// }};
	});
}


function refreshModelsVIew(context: vscode.ExtensionContext, treeView: vscode.TreeView<ModelItem>, selectedItem: ModelItem): void {

	context.workspaceState.update('ec-code-assist.activeModel', selectedItem.label)
			.then(() => {
				selectedItem.iconPath = new vscode.ThemeIcon('chat-editor-label-icon');
			});
	
}

// This method is called when your extension is deactivated
export function deactivate() { }




