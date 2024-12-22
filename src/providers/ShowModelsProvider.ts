import * as vscode from 'vscode';
import ollama from 'ollama';

/**
 * Represents a provider for the tree view that shows the models.
 * This provider fetches the models from the backend service and displays them in the tree view.
 */
export class ShowModelsProvider implements vscode.TreeDataProvider<ModelItem> {
 
    // private _models: ModelItem[] = [];
    
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
        
        console.debug('Getting children for tree view');
        
        return new Promise((resolve, reject) => {
            this._fetchModels()
                .then(models => {
                    console.debug('Models fetched:', models);
                    resolve(models);
                })
                .catch(err => reject(err));
        });

}

    /**
     * Refreshes the tree view.
     */
    public refresh(): void {
        console.debug('Refreshing tree view');
        this._onDidChangeTreeData.fire();
    }

    /**
     * Fetches the models from the backend service and populates the models array.
     */
    private async _fetchModels(): Promise<ModelItem[]> {

        // const currentActiveModel: string | undefined = this._context.workspaceState.get<string>('ec_assist.activeModel');

        let models: ModelItem[] = [];

        try {
            await ollama.list()
                        .then((modelsResponse: any) => { 
                            // alpabetize the models array by name
                            models = modelsResponse.models.sort((a: any, b: any) => a.name.localeCompare(b.name));
                        });
                        // .then((modelsResponse: any) => { 
                        //     // Add models to the models array
                        //     modelsResponse.models.forEach((model: any) => {

                        //         let modelItem = new ModelItem(model.name);
                                
                        //         // if no model is currently active, set the first model as active
                        //         // set the icon for the active model node
                        //         // save the active model in the workspace state
                        //         if(!currentActiveModel) {
                        //             modelItem.iconPath = new vscode.ThemeIcon('chat-editor-label-icon');
                        //             this._context.workspaceState.update('ec_assist.activeModel', modelItem.label)
                        //                     .then(() => {
                        //                         console.debug('First model set active:', modelItem.label);
                        //                     });
                        //         } 
                        //         // if a model is currently active, set the icon for the active model node
                        //         else if(currentActiveModel === model.name) {
                        //             modelItem.iconPath = new vscode.ThemeIcon('chat-editor-label-icon');
                        //             console.debug('Active model is already:', modelItem.label);
                        //         } else {
                        //             console.debug('Model inactive:', modelItem.label);
                        //         }
                                
                        //         models.push(modelItem);
                        //     });
                        // });
            
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
    constructor(label: string) {
        super(label, vscode.TreeItemCollapsibleState.None);
    }
}