import * as vscode from 'vscode';
import ollama from 'ollama';

/**
 * Represents a provider for the tree view that shows the models.
 * This provider fetches the models from the backend service and displays them in the tree view.
 */
export class ShowModelsProvider implements vscode.TreeDataProvider<ModelItem> {

    private readonly _context: vscode.ExtensionContext;

    private _onDidChangeTreeData: vscode.EventEmitter<ModelItem | ModelItem[] | undefined | null | void> = new vscode.EventEmitter<ModelItem | ModelItem[] | undefined | null | void>();

    /**
     * An event that is fired when the tree data changes.
     */
    public readonly onDidChangeTreeData: vscode.Event<ModelItem | ModelItem[] | undefined | null | void> = this._onDidChangeTreeData.event;

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
    public getTreeItem(element: ModelItem): vscode.TreeItem {

        const storedModel: string = this._context.workspaceState.get<string>('ec_assist.activeModel') || '';

        element.label = element.name;
        if (element.name === storedModel) {
            element.iconPath = new vscode.ThemeIcon('chat-editor-label-icon');
        }


        return element;
    }

    /**
     * Always returns the top level nodes of the tree view.
     * @param element When element is undefined, fetche the models
     * @returns 
     */
    async getChildren(element?: ModelItem): Promise<ModelItem[]> {

        return new Promise((resolve, reject) => {
            this._fetchModels()
                .then(models => {
                    // put a chat icon next to the active model
                    models.forEach(model => {
                        const storedModel = this._context.workspaceState.get<string>('ec_assist.activeModel');
                        if (storedModel === model.name) {
                            model.iconPath = new vscode.ThemeIcon('chat-editor-label-icon');
                        } else if (storedModel === undefined) {
                            models[0].iconPath = new vscode.ThemeIcon('chat-editor-label-icon');
                        }
                    });
                    resolve(models);
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
     * Updates the icon path for the selected item.
     * @param {ModelItem} selectedItem The selected item.
     */
    public updateIconPathForSelectedItem(selectedItem: ModelItem): void {
        const storedModel: string = this._context.workspaceState.get<string>('ec_assist.activeModel') || '';

        // Update the icon path for the selected item
        if (selectedItem.name === storedModel) {
            selectedItem.iconPath = new vscode.ThemeIcon('chat-editor-label-icon');
        } else {
            selectedItem.iconPath = undefined; // or set to a default icon
        }

        // Refresh the tree view
        this.refresh();
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
                    if (models.length <= 0) {
                        vscode.window.showErrorMessage('No models found. Please ensure Ollama is running.');
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
export class ModelItem extends vscode.TreeItem {

    name: string;

    /**
     * Initializes a new instance of the ModelItem class.
     * @param label The label of the model item.
     */
    constructor(label: string) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.name = label;
    }
}