import * as vscode from 'vscode';
import { Command } from './Command';

export class ShowModelsCommand implements Command {

    public readonly name: string = 'ec_assist_showModels';
    
    private readonly _context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        console.debug(`Command ${this.name} created`);
        this._context = context;

    }

    public execute(): void {
        console.debug(`Command ${this.name} executed`);
        try {
            
            // const models = this._fetchModels();


            vscode.commands.executeCommand('workbench.view.explorer');
        } catch (error) {
            console.error(`Failed to execute ${this.name} command:`, error);
            vscode.window.showErrorMessage(`Failed to execute ${this.name} command.`);
        }
    }
}