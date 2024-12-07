
import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { Command } from './Command';

export class ShowSelectedCodeCommand implements Command {

	private readonly _context: vscode.ExtensionContext;
	
	public readonly name: string = 'ec-assist.showSelectedCode';

	constructor(context: vscode.ExtensionContext) { 
		this._context = context;
	}

	public execute(): void {

		const panelTitle = 'Elegant Code Assist';

		const panelOptions = {
			enableScripts: true
		};

		const panel = vscode.window.createWebviewPanel(
			this.name,
			panelTitle,
			vscode.ViewColumn.One, // Editor column to show the new webview panel in.
			panelOptions
		);

		panel.webview.html = this._getWebviewContent();
	}

	private _getWebviewContent(): string {

		const code = this._getCodeToShow();
	
		const filePath: vscode.Uri = vscode.Uri.file(path.join(this._context.extensionPath, 'src', 'resources', 'webviews', 'showSelectedCode.html'));
		
		let html = fs.readFileSync(filePath.fsPath, 'utf8');
		html = html.replace('{{selectedCode}}', code);
		
		return html;
	}

	private _getCodeToShow(): string {

		const editor = vscode.window.activeTextEditor;
		let selectedCode: string = '';

		// ensure a docment is open
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// Get the selected text if any, otherwise, get the entire document text
			if (selection.isEmpty) {
				selectedCode = document.getText();
			} else {
				selectedCode = document.getText(selection);
			}
		} else {
			selectedCode = 'No document is active.';
		}

		return selectedCode.trim();
	}
}

