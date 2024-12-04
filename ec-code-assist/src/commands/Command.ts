import * as vscode from 'vscode';

export interface Command {
    execute(): void;
    name: string;
}