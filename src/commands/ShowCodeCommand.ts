import * as vscode from 'vscode';
import { Command } from './Command';
import OllamaChatService from '../services/OllamaChatService';
import ChatReplyHtmlBuilder, { PageModel } from '../util/ChatReplyHtmlBuilder';

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
	public name: string = 'ec_assist_showCode';

	/**
	 * Constructor.
	 * @param context The extension context.
	 */
	constructor(context: vscode.ExtensionContext) {
		this._context = context;
        console.debug(`Command ${this.name} created`);
	}

	/**
	 * Execute the command.
	 * 	- If the panel already exists, reveal it.
	 * 	- Create a webview panel.
	 * 	- Get the code to show in the panel.
	 * 	- Load the code in the webview panel.
	*/
	public async execute(): Promise<void> {

        console.debug(`Command ${this.name} executed`);

		const htmlBuilder: ChatReplyHtmlBuilder = new ChatReplyHtmlBuilder(this._context);

		// Get the active text editor column
		const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
		const pageModel = await this._getPageModel();

		// If the panel already exists, reveal it, otherwise, create a new panel
		if(this._panel) {
			this._panel.webview.html = htmlBuilder.getWebViewHtml(pageModel);
			this._panel.reveal(column);
		} else {
			this._panel = vscode.window.createWebviewPanel(
				this.name,
				this._panelTitle,
				column || vscode.ViewColumn.One,
				this._panelOptions
			);

			this._panel.webview.html = htmlBuilder.getWebViewHtml(pageModel);
			
			this._panel.onDidDispose(() => {
				this._panel = undefined;
			});
		}
	}
	
	/**
	 * Get the content to show in the webview panel HTML
	 */
	private async _getPageModel(): Promise<PageModel> {


		let pageModel: PageModel = {
			model: this._context.workspaceState.get('ec-code-assist.activeModel') || '',
			originalCode: 'No active document.',
			language: '',
			chatReply: ''
		};

		const editor = vscode.window.activeTextEditor;
		
		// ensure a document is open
		if (editor) {
			const ollamaChat = new OllamaChatService(this._context);

			let codeLanguage: string;
			let originalCode: string;

			// get the user's code from the active document
			({ codeLanguage, originalCode } = this._getOriginalCode(editor));
			
			pageModel.language = codeLanguage;
			pageModel.originalCode = originalCode;

			// Get the chat response from Ollama
			await ollamaChat.chat(originalCode, codeLanguage)
				.then((chatResponse: any) => {
					pageModel.chatReply = JSON.stringify(chatResponse);
				});
		}

		return pageModel;
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

