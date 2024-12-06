import * as vscode from 'vscode';
import { Command } from './Command';
import { SelectedCodeViewProvider } from '../views/SelectedCodeViewProvider';

export class ShowSelectedCodeCommand implements Command {

	public readonly name: string  = 'ec-assist.showSelectedCode';
	
	private viewProvider: SelectedCodeViewProvider;
	
	constructor(selectedCodeViewProvider: SelectedCodeViewProvider) { 
		this.viewProvider = selectedCodeViewProvider;
	}
    
	public execute(): void {

        const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			if (selection.isEmpty) {
				vscode.window.showErrorMessage('No text selected');
			} else {
				const text = document.getText(selection);
				this.viewProvider.showCode(text);
				vscode.window.showInformationMessage('Selected text is: ' + text);
			}
		} else {
			vscode.window.showInformationMessage('No text editor open');
		}
	
    }
}