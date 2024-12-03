import * as vscode from 'vscode';
import { Command } from './command';

export class HelloWorldCommand implements Command {
    
    name: string = 'ec-code-assist.helloWorld';

    execute(context: vscode.ExtensionContext, args?: string[]): void {
        vscode.window.showInformationMessage('Hello World from EC Code Assist!');
    }
}