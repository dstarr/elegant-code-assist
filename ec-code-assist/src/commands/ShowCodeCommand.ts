import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { Command } from './Command';
import ollama, { ChatRequest, ChatResponse } from 'ollama';

/**
 * Interface for passing the code to show in the webview panel.
 */
interface PageModel {
	originalCode: string;
	language: string;
	chatCode: string;
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
	public execute(): void {

        console.debug(`Command ${this.name} executed`);

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

		let pageModel: PageModel = this._getPageModel();

		const htmlPath = vscode.Uri.file(path.join(this._context.extensionPath, 'src', 'resources', 'webviews', 'showSelectedCode.html')).with({ scheme: 'vscode-resource' });

		let html = fs.readFileSync(htmlPath.fsPath, 'utf8');

		// do token replacement in the HTML
		html = html.replace('{{codeLanguage}}', pageModel.language);
		html = html.replace('{{originalCode}}', pageModel.originalCode);
		html = html.replace('{{chatCode}}', pageModel.chatCode);

		return html;
	}

	/**
	 * Get the content to show in the webview panel HTML.
	 */
	private _getPageModel(): PageModel {

		let pageModel: PageModel = {
			originalCode: 'No active document.',
			language: '',
			chatCode: ''
		};
		
		const editor = vscode.window.activeTextEditor;
		
		// ensure a document is open
		if (editor) {
			let codeLanguage: string;
			let originalCode: string;

			({ codeLanguage, originalCode } = this._getOriginalCode(editor));

			// Get the chat code
			const chatCode: string = this._getChatCode(originalCode, codeLanguage);

			pageModel.language = codeLanguage;
			pageModel.originalCode = originalCode;
			pageModel.chatCode = chatCode;

		}

		return pageModel;
	}

	
	/**
	 * Get the chat code from ollama.
	 * @param originalCode The original code.
	 * @param codeLanguage The language of the original code.
	 */
	private _getChatCode(originalCode: string, codeLanguage: string): string {

		try {
			// Send a request to the chat API reponse
			const chatRequest: ChatRequest & {stream: true} = this._getChatPrompt(originalCode, codeLanguage);
			ollama.chat(chatRequest)
				.then((response) => {
					console.debug(response);
					return "GOT IT";
				});
			
		} catch (error) {
			console.error(error);
			throw error;
		}

		return "Error chatting";
	}

	/**
	 * Get the chat prompt for ollama.
	 * @param originalCode The original code.
	 * @param codeLanguage The language of the original code.
	 * @returns The chat request with the original code and language.
	 */
	private _getChatPrompt(originalCode: string, codeLanguage: string): ChatRequest & { stream: true; } {
		// Intersection type combining ChatRequest and an inline type with stream property set to true
		return {
			model: this._context.workspaceState.get('ec_assist.activeModel') || '',
			messages: [{ role: 'user', content: 'Why is the sky blue?' }]
		} as ChatRequest & { stream: true; };
	}

	/**
	 * Get the original code from the active document.
	 * Values can be:
	 * - The selected text if any.
	 * - The entire document text if no text is selected.
	 * @param editor The active text editor.
	 */
	private _getOriginalCode(editor: vscode.TextEditor) {

		let code: string = "No active document.";
		let codeLanguage: string = '';

		const document = editor.document;
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

