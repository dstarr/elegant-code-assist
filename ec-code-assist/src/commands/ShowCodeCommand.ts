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
	private readonly _panelTitle: string = 'Elegant Code Assist';
	private readonly _panelOptions: vscode.WebviewOptions = {
		enableScripts: true
	};
	
	private _panel: vscode.WebviewPanel | undefined;
	
	/**
	 * This is the command identifier that the command is registered with.
	 */
	public name: string = 'ec_assist_.showSelectedCode';

	/**
	 * Constructor.
	 * @param context The extension context.
	 */
	constructor(context: vscode.ExtensionContext) {
		this._context = context;
		console.debug('ShowCodeCommand created.');
	}

	/**
	 * Execute the command.
	 * 	- If the panel already exists, reveal it.
	 * 	- Create a webview panel.
	 * 	- Get the code to show in the panel.
	 * 	- Load the code in the webview panel.
	*/
	public execute(): void {

		// Get the active text editor column
		const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

		// If the panel already exists, reveal it
		if(this._panel) {
			this._panel.webview.html = this._getWebviewContent();
			this._panel.reveal(column);
		} else {
			// Create a new webview panel
			this._panel = vscode.window.createWebviewPanel(
				this.name,
				this._panelTitle,
				column || vscode.ViewColumn.One,
				this._panelOptions
			);
			this._panel.webview.html = this._getWebviewContent();
			
			this._panel.onDidDispose(() => {
				this._panel = undefined;
			});
		}
		
	}

	/**
	 * Get the HTML content for the webview panel.
	 * @param panel The webview panel.
	 */
	private _getWebviewContent(): string {

		const codeInfo = this._getCodeToShow();
		const htmlPath = vscode.Uri.file(path.join(this._context.extensionPath, 'src', 'resources', 'webviews', 'showSelectedCode.html')).with({ scheme: 'vscode-resource' });

		console.debug(htmlPath.toString());

		let html = fs.readFileSync(htmlPath.fsPath, 'utf8');
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

		// ensure a document is open
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;
			codeLanguage = editor.document.languageId;

			// Get the selected text if any, otherwise, get the entire document text
			if (selection.isEmpty) {
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

