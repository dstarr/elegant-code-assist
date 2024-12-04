import * as vscode from 'vscode';
import { Command } from './Command';

export class ShowSelectedCodeCommand implements Command {
    
	// The command identifier
    readonly name: string = 'ec-code-assist.showSelectedCode';

    execute(): void {
     
        const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			if (selection.isEmpty) {
				vscode.window.showInformationMessage('No text selected');
			} else {
				const text = document.getText(selection);
				vscode.window.showInformationMessage('Selected text is: ' + text);
			}
		}
    }
}