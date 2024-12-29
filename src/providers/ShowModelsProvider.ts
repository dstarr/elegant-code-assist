import * as vscode from 'vscode';
import ollama from 'ollama';
import { STATE_MANAGEMENT } from '../util/Constants';

/**
 * Represents a provider for the tree view that shows the models.
 * This provider fetches the models from the backend service and displays them in the tree view.
 */
export class ShowModelsProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    private readonly _context: vscode.ExtensionContext;

    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | vscode.TreeItem[] | undefined | null | void> = new vscode.EventEmitter<vscode.TreeItem | vscode.TreeItem[] | undefined | null | void>();

    /**
     * An event that is fired when the tree data changes.
     */
    public readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | vscode.TreeItem[] | undefined | null | void> = this._onDidChangeTreeData.event;

    /**
     * Initializes a new instance of the ShowModelsProvider class.
     * @param {vscode.ExtensionContext} context The extension context.
     */
    constructor(context: vscode.ExtensionContext) {
        this._context = context;
    }

    /**
      * Returns the tree item for the given model item.
      * @param {ModelItem} element The model item to be displayed.
      * @returns {ModelItem} The tree item for the given model item.
      */
    public getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    /**
     * Always returns the top level nodes of the tree view.
     * @param element When element is undefined, fetche the models
     * @returns 
     */
    async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {

        let storedModel = this._context.workspaceState.get<string>(STATE_MANAGEMENT.WORKSPACE_STATE_ACTIVE_MODEL);
        let treeItems: vscode.TreeItem[] = [];

        return new Promise((resolve, reject) => {
            this._fetchModels()
                .then(async models => {
                    
                    if(storedModel === undefined && models.length > 0) {
                        await this._context.workspaceState.update(STATE_MANAGEMENT.WORKSPACE_STATE_ACTIVE_MODEL, models[0].name)
                            .then(() => {
                                storedModel = models[0].name;
                            });
                    }
                    
                    // put a chat icon next to the active model
                    vscode.window.showInformationMessage(`Active model: ${storedModel}` );

                    models.forEach(model => {
                        let treeViewItem = new vscode.TreeItem(model.name);
                        if (treeViewItem.label === storedModel) {
                            treeViewItem.iconPath = new vscode.ThemeIcon('chat-editor-label-icon');
                        } 
                        treeItems.push(treeViewItem);

                    });
                    resolve(treeItems);
                })
                .catch(err => reject(err));
        });

    }

    /**
     * Refreshes the tree view.
     */
    public refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    /**
     * Fetches the models from the backend service and populates the models array.
     * @returns {Promise<ModelItem[]>} The models array.
     */
    private async _fetchModels(): Promise<ModelItem[]> {

        let models: ModelItem[] = [];

        try {

            await ollama.list()
                .then((modelsResponse: any) => {
                    // alpabetize the models array by name
                    models = modelsResponse.models.sort((a: any, b: any) => a.name.localeCompare(b.name));

                    // signal if no model is found
                    if (models.length <= 0) {
                        vscode.window.showErrorMessage('No models found.');
                    }

                });

        } catch (error) {
            console.error('Error fetching models:', error);
        }

        return models;
    }
}

/**
 * Represents a model item, a node in the tree view.
 */
class ModelItem {

    /**
     * Initializes a new instance of the ModelItem class.
     * @param label The label of the model item.
     */
    constructor(public name: string) {
        
    }
}