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
export class ShowCodeCommand implements Command {

	private readonly _context: vscode.ExtensionContext;
	private readonly panelTitle: string = 'Elegant Code Assist';
	private readonly panelOptions: vscode.WebviewOptions = {
		enableScripts: true
	};
	private panel: vscode.WebviewPanel | undefined;
	
	public name: string = 'ec-assist.showSelectedCode';
	
	constructor(context: vscode.ExtensionContext) {
		this._context = context;
		console.debug('ShowCodeCommand created.');
	}

	/**
	 * Execute the command.
	 *	- Create a webview panel.
	 *	- Get the code to show in the panel.
	 *	- Load the code in the webview panel.
	 */
	public execute(): void {

		console.debug('Executing ShowCodeCommand.');

		const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

		if(this.panel) {
			this.panel.webview.html = this._getWebviewContent();
			this.panel.reveal(column);
			console.debug('Revealed the webview panel.');
		} else {
			this.panel = vscode.window.createWebviewPanel(
				this.name,
				this.panelTitle,
				column || vscode.ViewColumn.One,
				this.panelOptions
			);
			this.panel.webview.html = this._getWebviewContent();
			
			this.panel.onDidDispose(() => {
				this.panel = undefined;
			});
			console.debug('Created the webview');
		}
		
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

