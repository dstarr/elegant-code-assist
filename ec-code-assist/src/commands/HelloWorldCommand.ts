import * as vscode from 'vscode';
import { Command } from './Command';

export class HelloWorldCommand implements Command {
    
    public readonly name: string  = 'ec-code-assist.helloWorld';

    public execute(): void {
        vscode.window.showInformationMessage('Hello World from EC Code Assist command!');
    }
}