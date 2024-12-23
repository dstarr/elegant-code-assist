import * as vscode from 'vscode';
import { ModelItem, ShowModelsProvider } from "./ShowModelsProvider";

/**
 * Class for registering the providers for the extension.
 */
export class ProviderRegistrar {

    private readonly _context: vscode.ExtensionContext;

    /**
     * Constructor.
     * @param context The extension context.
     */
    constructor(context: vscode.ExtensionContext) {
        console.debug(`ProviderBuilder created`);
        this._context = context;
    }

    /**
     * Register the model tree provider and configure the tree view events.
     * @param showModelsProvider The provider for showing the models.
     */
    public registerModelTreeProvider(showModelsProvider: ShowModelsProvider): void {

        console.debug(`Provider ShowModelsProvider registered`);
        
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