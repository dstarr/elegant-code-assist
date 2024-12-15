import * as vscode from 'vscode';
import { Command } from './Command';

export class HelloWorldCommand implements Command {
    
    public readonly name: string  = 'ec_assist_helloWorld';

    constructor() {
        console.debug(`Command ${this.name} created`);
    }

    public execute(): void {
        console.debug(`Command ${this.name} executed`);
        vscode.window.showInformationMessage('Hello World from EC Code Assist command!');
    }
}