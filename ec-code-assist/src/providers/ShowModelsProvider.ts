import * as vscode from 'vscode';
import ollama from 'ollama';

/**
 * Represents a provider for the tree view that shows the models.
 * This provider fetches the models from the backend service and displays them in the tree view.
 */
export class ShowModelsProvider implements vscode.TreeDataProvider<ModelItem> {
 
    private _models: ModelItem[] = [];
    private readonly _onDidChangeTreeData: vscode.EventEmitter<ModelItem | undefined | void>;
    
    readonly onDidChangeTreeData: vscode.Event<ModelItem | undefined | void>;

    constructor() {

        this._onDidChangeTreeData = new vscode.EventEmitter<ModelItem | undefined | void>();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    getTreeItem(element: ModelItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: ModelItem): Promise<ModelItem[]> {

        await this.fetchModels();
        
        // Return child items of the passed element
        return this._models;
    }

    /**
     * Refreshes the tree view.
     * This method is called when the tree view needs to be refreshed.
     */
    async refresh(): Promise<void> {
        
        await this.fetchModels();

        this._onDidChangeTreeData.fire();
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