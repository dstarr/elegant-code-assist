import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { Command } from './Command';

/**
 * Interface for passing the code to show in the webview panel.
 */
interface CodeToShow {
	code: string;
	language: string;
}

/**
 * Command to show the code in a webview panel.
 */
export class ShowSelectedCodeCommand implements Command {

	private readonly _context: vscode.ExtensionContext;
	
	public readonly name: string = 'ec-assist.showSelectedCode';

	constructor(context: vscode.ExtensionContext) { 
		this._context = context;
	}

	/**
	 * Execute the command.
	 *	- Create a webview panel.
	 *	- Get the code to show in the panel.
	 *	- Load the code in the webview panel.
	 */
	public execute(): void {

		const panelTitle = 'Elegant Code Assist';

		const panelOptions = {
			enableScripts: true
		};

		const panel: vscode.WebviewPanel = vscode.window.createWebviewPanel(
			this.name,
			panelTitle,
			vscode.ViewColumn.One, // Editor column to show the new webview panel in.
			panelOptions
		);

		panel.webview.html = this._getWebviewContent();
	}

	/**
	 * Get the HTML content for the webview panel.
	 * @param panel The webview panel.
	 */
	private _getWebviewContent(): string {

		const codeInfo = this._getCodeToShow();
	
		const htmlPath: string = vscode.Uri.file(path.join(this._context.extensionPath, 'src', 'resources', 'webviews', 'showSelectedCode.html')).path;

		let html = fs.readFileSync(htmlPath, 'utf8');

		html = html.replace('{{code}}', codeInfo.code);
		html = html.replace('{{language}}', codeInfo.language);
		
		return html;
	}

	/**
	 * Get the code to show in the webview panel HTML.
	 */
	private _getCodeToShow(): CodeToShow {

		const editor = vscode.window.activeTextEditor;
		let code: string = '';
		let codeLanguage: string = '';

		// ensure a docment is open
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;
			code = editor.document.languageId;

			if (selection.isEmpty) {
				// Get the selected text if any, otherwise, get the entire document text
				code = document.getText();
			} else {
				code = document.getText(selection);
			}
		} else {
			code = 'No document is active.';
		}

		return {
			code: code.trim(),
			language: codeLanguage
		};
		
	}
}

