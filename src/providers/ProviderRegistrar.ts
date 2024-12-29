import { ShowModelsProvider } from "./ShowModelsProvider";
import * as vscode from 'vscode';
import { STATE_MANAGEMENT, VIEWS } from '../util/Constants';

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

        console.debug(`Provider ShowModelsProvider registering`);

        // Create the tree view
        const treeView = vscode.window.createTreeView(VIEWS.MODELS_TREE, {
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
        treeView.onDidChangeSelection(async (event) => {

            console.debug(`Selection changed: ${event.selection[0]?.label}`);

            if (event.selection.length <= 0) {
                return;
            }

            const selectedItem = event.selection[0];

            Promise.resolve(
                this._context.workspaceState.update(STATE_MANAGEMENT.WORKSPACE_STATE_ACTIVE_MODEL, selectedItem.label)
                    .then(() => {
                        console.debug(`Workspace state updated: ${selectedItem.label}`);
                        showModelsProvider.refresh();
                })
            );

        });

        this._context.subscriptions.push(treeView);
    }


}