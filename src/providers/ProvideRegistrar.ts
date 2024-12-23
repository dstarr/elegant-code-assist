import * as vscode from 'vscode';
import { ModelItem, ShowModelsProvider } from "./ShowModelsProvider";

/**
 * Class for registering the providers for the extension.
 */
export class ProvideRegistrar {

    private readonly _context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        console.debug(`ProviderBuilder created`);
        this._context = context;
    }

    public registerModelTreeProvider(showModelsProvider: ShowModelsProvider): void {
        
        // Create the tree view
        const treeView = vscode.window.createTreeView('ec_assist_modelsView', {
            treeDataProvider: showModelsProvider,
            canSelectMany: false
        });

        // refreh the tree view when it becomes visible
        treeView.onDidChangeVisibility(event => {
            if (event.visible) {
                showModelsProvider.refresh();
            }
        });

        // Handle selection changes
        treeView.onDidChangeSelection((event) => {

            if (event.selection.length < 0) {
                return;
            }

            const selectedItem = event.selection[0];

            if (event.selection.length > 0) {
                const selectedItem = event.selection[0] as ModelItem;
                this._context.workspaceState.update('ec_assist.activeModel', selectedItem.name)
                    .then(() => {
                        showModelsProvider.updateIconPathForSelectedItem(selectedItem);
                    });
            }
        });
    }


}