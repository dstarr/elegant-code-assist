import * as vscode from 'vscode';
import { Command } from './Command';

export class HelloWorldCommand implements Command {
    
    readonly name: string = 'ec-code-assist.helloWorld';

    execute(): void {
        vscode.window.showInformationMessage('Hello World from EC Code Assist command!');
    }
}