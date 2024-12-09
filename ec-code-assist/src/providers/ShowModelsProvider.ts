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

    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter<ModelItem>();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
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
    public async getChildren(element?: ModelItem): Promise<ModelItem[]> {
        if(!element) {
            await this.fetchModels();
        }
        
        return this._models;
    }

    /**
     * Refreshes the tree view.
     * This method is called when the tree view needs to be refreshed.
     */
    public async refresh(): Promise<void> {
        // await this.fetchModels();
        // this._onDidChangeTreeData.fire();
    }

    /**
     * Fetches the models from the backend service and populates the models array.
     */
    private async fetchModels(): Promise<void> {

        try {
            await ollama.list()
                        .then((modelsResponse: any) => { 
                            // Clear the models array
                            this._models = [];
                            
                            // Add models to the models array
                            modelsResponse.models.forEach((model: any) => {
                                this._models.push(new ModelItem(model.name));
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