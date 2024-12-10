import * as vscode from 'vscode';
import ollama from 'ollama';

/**
 * Represents a provider for the tree view that shows the models.
 * This provider fetches the models from the backend service and displays them in the tree view.
 */
export class ShowModelsProvider implements vscode.TreeDataProvider<ModelItem> {
 
    private _models: ModelItem[] = [];
    
    private readonly _context: vscode.ExtensionContext;

    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | null | void> = new vscode.EventEmitter<vscode.TreeItem | undefined | null | void>();
    
    public readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(context: vscode.ExtensionContext) {
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
     * Refreshes the tree view.
     */
    public refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    /**
     * Fetches the models from the backend service and populates the models array.
     */
    private async _fetchModels(): Promise<void> {

        const currentActiveModel: string | undefined = this._context.workspaceState.get<string>('ec_assist.activeModel');
        let modelIsAssigned: boolean = currentActiveModel !== '' && currentActiveModel !== undefined;

        try {
            await ollama.list()
                        .then((modelsResponse: any) => { 
                            // Clear the models array
                            this._models = [];
                            
                            // Add models to the models array
                            modelsResponse.models.forEach((model: any) => {

                                let modelItem = new ModelItem(model.name);
                                
                                // if no model is currently active, set the first model as active
                                // set the icon for the active model node
                                // save the active model in the workspace state
                                if(!modelIsAssigned) {
                                    modelItem.iconPath = new vscode.ThemeIcon('chat-editor-label-icon');
                                    modelIsAssigned = true;
                                    this._context.workspaceState.update('ec_assist.activeModel', model.name)
                                            .then(() => {
                                                console.debug('First model set active:', model.name);
                                            });
                                            // set the icon for the active model node
                                } else if(model.name === currentActiveModel) {
                                    modelItem.iconPath = new vscode.ThemeIcon('chat-editor-label-icon');
                                    console.debug('Active model:', model.name);
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