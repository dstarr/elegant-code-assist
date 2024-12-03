import * as vscode from 'vscode';

export interface Command {
    execute(context: vscode.ExtensionContext, args?: string[]): void;
    name: string;
}