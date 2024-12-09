import * as vscode from 'vscode';
import { Command } from './Command';

export class ShowModelsCommand implements Command {

    public readonly name: string = 'ec_assist_showModels';

    constructor() {

        console.debug('ShowModelsCommand created.');
    }

    public execute(): void {
        try {
            console.debug('Show Models command executed.');
            vscode.commands.executeCommand('workbench.view.explorer');
            // vscode.commands.executeCommand('workbench.view.extension.ec_assist_showModels');
        } catch (error) {
            console.error('Failed to execute Show Models command:', error);
            vscode.window.showErrorMessage('Failed to execute Show Models command.');
        }
    }
}