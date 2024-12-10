import * as vscode from 'vscode';
import ollama from 'ollama';
import { Command } from './Command';

export class ActivateModelCommand implements Command {
    
    public readonly name: string  = 'ec_assist_activateModel';
    private readonly _context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
	   console.debug(`Command ${this.name} created`);
       this._context = context;
	}

    public async execute(modelItem: vscode.TreeItem): Promise<void> {
        console.debug(`Command ${this.name} executed`);
        if(!modelItem) {
            return;
        }

        // save the active model in the workspace state
        await this._context.workspaceState.update('ec_assist_activeModel', modelItem.label)
                .then(() => {
                    // show an icon next to the active item
                    modelItem.iconPath = new vscode.ThemeIcon('chat-editor-label-icon');
                    
                    vscode.commands.executeCommand('ec_assist_refreshModelsView');
                    
                    vscode.window.showInformationMessage(`Model activated: ${modelItem.label}`);
                });
    }
}