import * as vscode from 'vscode';
import { Command } from './command';

export class ShowSelectedCodeCommand implements Command {
    
    name: string = 'ec-code-assist.showSelectedCode';

    execute(context: vscode.ExtensionContext, args?: string[]): void {
     
        const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;
			const text = document.getText(selection);
			vscode.window.showInformationMessage('Selected text is: ' + text);
		}
    }
}