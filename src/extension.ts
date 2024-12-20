import * as vscode from 'vscode';
import { CommandRegistrar } from './commands/CommandRegistrar';
import { ShowModelsProvider } from './providers';
import { NodeDependenciesProvider } from './providers/NodeDependencyProvider';

/**
 * This method is called when your extension is activated
 * Your extension is activated the very first time the command is executed
 * @param context: vscode.ExtensionContext
*/
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, EC Code Assist" is now active!');

	// initializeDataProviders(context);
	
	// Register the command events for the extension
	const commandRegistrar = new CommandRegistrar();
	commandRegistrar.registerCommandEvents(context);

	// register the node dependecies provider
	const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
	console.debug('Root path:', rootPath);
	
	if(rootPath) {
		vscode.window.registerTreeDataProvider(
			'nodeDependencies',
			new NodeDependenciesProvider(rootPath)
		);
	}

	const showModelsProvider = new ShowModelsProvider(context);
	const treeView = vscode.window.createTreeView('ec_assist_modelsView', {
		treeDataProvider: showModelsProvider,
		canSelectMany: false
	});

	treeView.onDidChangeSelection(async (event) => {
		const selectedItems = event.selection;

		if (selectedItems.length > 0) {
			let selectedItem = selectedItems[0];
			// selectedItem.iconPath = new vscode.ThemeIcon('chat-editor-label-icon');
			await context.workspaceState.update('ec-code-assist.activeModel', selectedItem.label)
				.then(() => {
					showModelsProvider.refresh();
					console.debug('New model selected:', selectedItem.label);
				});
		}
	});
}

/**
 * Initialize the data providers for the extension
 */
function initializeDataProviders(context: vscode.ExtensionContext) {
	
	const showModelsProvider: ShowModelsProvider = new ShowModelsProvider(context);
	const treeView = vscode.window.createTreeView('ec_assist_modelsView', {
		treeDataProvider: showModelsProvider,
		canSelectMany: false
	});

	// Listen for changes in the selection of the TreeView
    treeView.onDidChangeSelection(async (event) => {
        // When the selection changes, event.selection will contain the selected items
        const selectedItems = event.selection;

		// if there are items, there is only one
        if (selectedItems.length > 0) {
            let selectedItem = selectedItems[0]; // The first (only) selected item
			
			console.debug('Selected item:', selectedItem.label);

            selectedItem.iconPath = new vscode.ThemeIcon('chat-editor-label-icon');
			
			await context.workspaceState.update('ec-code-assist.activeModel', selectedItem.label)
				.then(() => {
					showModelsProvider.refresh();
					console.debug('Active model set:', selectedItem.label);
				});
        }
    });
}

// This method is called when your extension is deactivated
export function deactivate() { }




