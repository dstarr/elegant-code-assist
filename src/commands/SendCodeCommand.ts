import * as vscode from 'vscode';
import { Command } from './Command';
import HtmlBuilder, { PageModel } from '../services/HtmlBuilder';
import OllamaChatService, { OllamaChatReply } from '../services/OllamaChatService';

/**
 * Command to show the code in a webview panel.
 */
export class SendCodeCommand implements Command {

	private readonly _context: vscode.ExtensionContext;

	private _panel: vscode.WebviewPanel | undefined;

	/**
	 * This is the command identifier that the command is registered with.
	 */
	public name: string = 'ec_assist_sendCode';

	/**
	 * Constructor.
	 * @param context The extension context.
	 */
	constructor(context: vscode.ExtensionContext) {
		console.debug(`Command ${this.name} created`);
		this._context = context;
	}

	/**
	 * Execute the command.
	 * 	- If the panel already exists, reveal it.
	 * 	- Create a webview panel.
	 * 	- Get the code to show in the panel.
	 * 	- Load the code in the webview panel.
	*/
	public execute(): void {

		console.debug(`Command ${this.name} executed`);

		const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		// Get the original code from the active document
		const { codeLanguage, originalCode } = this._getOriginalCode(editor);

		// Show the code in the webview panel
		this._showWebViewPanel(codeLanguage, originalCode);

		// send the webpanel a message
		console.log("Posting to webview 1:", this._panel);
		this._panel?.webview.postMessage({
			command: 'ec_assist_webview_update',
			text: "GOT IT 1"
		}).then(() => {
			console.log("Posted to webview 1");
		});

		// get the response from ollama
		const ollamaChatService = new OllamaChatService(this._context);
		ollamaChatService.chat(originalCode, codeLanguage)
			.then((reply: OllamaChatReply) => {
				console.log("Posting Ollama response to webview");

				if(!this._panel) {
					console.debug("No panel to post to");
				}

				// send the webpanel a message
				this._panel?.webview.postMessage({
					command: '	',
					overview: reply.overview,
					text: "GOT IT",
					suggestions: reply.suggestions
				});

			})
			.catch((error: any) => {
				console.error(error);
			});
	}

	/**	
	 * Show the initial webview panel.
	 * @param codeLanguage The code language.
	 * @param originalCode The original code
	 */
	private _showWebViewPanel(codeLanguage: string, originalCode: string): void {

		const pageModel = this._getPageModel(codeLanguage, originalCode);

		const htmlBuilder: HtmlBuilder = new HtmlBuilder(this._context);
		const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

		// If the panel already exists, reveal it. Otherwise, create a new panel.
		if (this._panel) {
			this._panel.webview.html = htmlBuilder.getWebViewHtml(pageModel);
			
			
			this._panel.webview.onDidReceiveMessage(
				message => {
					console.debug("Received message from webview", message);
				},
				undefined,
				this._context.subscriptions
			);

			this._panel.reveal(column);

		} else {

			const panelTitle: string = 'Elegant Code Assist';
		
			this._panel = vscode.window.createWebviewPanel(
				'ecAssist',
				panelTitle,
				column || vscode.ViewColumn.One,
				{
					enableScripts: true,
					enableForms: true,
					retainContextWhenHidden: true
				}
			);

			this._panel.webview.html = htmlBuilder.getWebViewHtml(pageModel);

			// Handle the panel dispose event
			this._panel.onDidDispose(() => {
				this._panel = undefined;
			});
		}
	}

	/**
	 * Get the content to show in the webview panel HTML
	 */
	private _getPageModel(codeLanguage: string, originalCode: string): PageModel {

		return {
			model: this._context.workspaceState.get<string>('ec_assist.activeModel') || '',
			originalCode: originalCode,
			language: codeLanguage
		};
	}

	/**
	 * Get the original code from the active document.
	 * Values can be:
	 * - The selected text if any.
	 * - The entire document text if no text is selected.
	 * @param editor The active text editor.
	 */
	private _getOriginalCode(editor: vscode.TextEditor): { codeLanguage: string; originalCode: string; } {

		let code: string = "No active document.";
		let codeLanguage: string = '';

		const document = editor.document;
		if (!document) {
			return { codeLanguage, originalCode: code };
		}

		const selection = editor.selection;
		codeLanguage = editor.document.languageId;

		// Get the selected text if any, otherwise, get the entire document text
		if (selection.isEmpty) {
			code = document.getText();
		} else {
			code = document.getText(selection);
		}
		return { codeLanguage, originalCode: code };
	}
}

