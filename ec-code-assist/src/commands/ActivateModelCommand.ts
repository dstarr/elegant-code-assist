import * as vscode from 'vscode';
import { Command } from './Command';

export class HelloWorldCommand implements Command {
    
    public readonly name: string  = 'ec_assist_activateModel';

    public execute(): void {
        vscode.window.showInformationMessage('EC Code Assist model activated!');
    }


}