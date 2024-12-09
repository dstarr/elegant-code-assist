import * as vscode from 'vscode';
import { Command } from './Command';

export class ShowModelsCommand implements Command {

    public readonly name: string = 'ec_assist_showModels';

    constructor() {
        console.debug(`Command ${this.name} created`);
    }

    public execute(): void {
        console.debug(`Command ${this.name} created`);
        try {
            vscode.commands.executeCommand('workbench.view.explorer');
            // vscode.commands.executeCommand('workbench.view.extension.ec_assist_showModels');
        } catch (error) {
            console.error(`Failed to execute ${this.name} command:`, error);
            vscode.window.showErrorMessage(`Failed to execute ${this.name} command.`);
        }
    }
}