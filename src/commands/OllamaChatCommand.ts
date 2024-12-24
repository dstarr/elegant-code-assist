import * as vscode from 'vscode';
import { Command } from './Command';

export class OllamaChatCommand implements Command {
    
    public readonly name: string  = 'ec_assist_ollamaChat';

    constructor() {
        console.debug(`Command ${this.name} created`);
    }

    public execute(): void {
        console.debug(`Command ${this.name} executed`);
        vscode.window.showInformationMessage('EC Code Assist command!', 'ec_assist_ollamaChat');
    }
}