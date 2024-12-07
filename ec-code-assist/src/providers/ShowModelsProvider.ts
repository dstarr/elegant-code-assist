import * as vscode from 'vscode';

/**
 * Represents a provider for the tree view that shows the models.
 * This provider fetches the models from the backend service and displays them in the tree view.
 */
export class ShowModelsProvider implements vscode.TreeDataProvider<ModelItem> {
 
    private _models: ModelItem[] | undefined;
    
    private readonly _onDidChangeTreeData: vscode.EventEmitter<ModelItem | undefined | void>;
    readonly onDidChangeTreeData: vscode.Event<ModelItem | undefined | void>;

    constructor() {

        this._models = undefined;
        this._onDidChangeTreeData = new vscode.EventEmitter<ModelItem | undefined | void>();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    getTreeItem(element: ModelItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: ModelItem): Promise<ModelItem[]> {

		console.debug("ShowModelsProvider.getChildren() called");

        if(!this._models) {
            await this._fetchModels();
        }
        
        // Return child items of the passed element
        return this._models || [];
    }

    
    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
    
    private async _fetchModels(): Promise<void> {
        
        // Call the backend service to get the models
        // For now, return some dummy data        

        let models = new Set<ModelItem>();
            models.add(new ModelItem("Model 1"));
            models.add(new ModelItem("Model 2"));

        // sleep for 2 seconds to simulate the delay in fetching the models
        await new Promise(resolve => setTimeout(resolve, 2000));

        this._models = Array.from(models);

        this._onDidChangeTreeData.fire();
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