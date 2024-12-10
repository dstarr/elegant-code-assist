import * as vscode from 'vscode';
import ollama from 'ollama';

/**
 * Represents a provider for the tree view that shows the models.
 * This provider fetches the models from the backend service and displays them in the tree view.
 */
export class ShowModelsProvider implements vscode.TreeDataProvider<ModelItem> {
 
    private _models: ModelItem[] = [];
    private readonly _onDidChangeTreeData: vscode.EventEmitter<ModelItem>;
    
    // Event that is fired when the tree view needs to be refreshed.
    public readonly onDidChangeTreeData: vscode.Event<ModelItem | undefined>;
    private readonly _context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this._onDidChangeTreeData = new vscode.EventEmitter<ModelItem>();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this._context = context;
    }

    /**
      * Returns the tree item for the given model item.
      * @param element The model item to be displayed.
      * @returns The tree item for the given model item.
      */
    public getTreeItem(element: ModelItem): vscode.TreeItem {
        return element;
    }

    /**
     * Always returns the top level nodes of the tree view.
     * @param element When element is undefined, fetche the models
     * @returns 
     */
    async getChildren(element?: ModelItem): Promise<ModelItem[]> {
        if (element) {
            return Promise.resolve([]);
        } else {
            await this._fetchModels();
            return Promise.resolve(this._models);
        }
    }

    /**
     * Fetches the models from the backend service and populates the models array.
     */
    private async _fetchModels(): Promise<void> {

        const currentActiveModel: string | undefined = this._context.workspaceState.get<string>('ec-code-assist.activeModel');
        let modelIsAssigned: boolean = currentActiveModel !== '' && currentActiveModel !== undefined;

        try {
            await ollama.list()
                        .then((modelsResponse: any) => { 
                            // Clear the models array
                            this._models = [];
                            
                            // Add models to the models array
                            modelsResponse.models.forEach((model: any) => {

                                let modelItem = new ModelItem(model.name);
                                
                                // Set the icon for the first model if no model is assigned
                                if(!modelIsAssigned) {
                                    modelItem.iconPath = new vscode.ThemeIcon('chat-editor-label-icon');
                                    modelIsAssigned = true;
                                    this._context.workspaceState.update('ec-code-assist.activeModel', model.name)
                                            .then(() => {
                                                console.debug('First model set active:', model.name);
                                            });
                                } else if(model.name === currentActiveModel) {
                                    modelItem.iconPath = new vscode.ThemeIcon('chat-editor-label-icon');
                                } 

                                this._models.push(modelItem);
                            });
                        });
            
        } catch (error) {
            console.error('Error fetching models:', error);
        }
    }
}

/**
 * Represents a model item, a node in the tree view.
 */
export class ModelItem extends vscode.TreeItem {
    constructor(label: string) {
        super(label, vscode.TreeItemCollapsibleState.None);
    }
}