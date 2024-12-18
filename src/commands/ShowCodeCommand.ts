import * as vscode from 'vscode';
import { PromptGenerator } from '../util/PromptGenerator';
import { Command } from './Command';
import ollama, { ChatRequest, ChatResponse } from 'ollama';
import { ResourceReader } from '../util/ResourceReader';


/**
 * Interface for passing the code to show in the webview panel.
 */
interface PageModel {
	originalCode: string;
	language: string;
	chatReply: string;
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
	public async execute(): Promise<void> {

        console.debug(`Command ${this.name} executed`);

		// Get the active text editor column
		const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
		const pageModel = await this._getPageModel();

		// If the panel already exists, reveal it, otherwise, create a new panel
		if(this._panel) {
			this._panel.webview.html = this._getWebViewHtml(pageModel);
			this._panel.reveal(column);
		} else {
			this._panel = vscode.window.createWebviewPanel(
				this.name,
				this._panelTitle,
				column || vscode.ViewColumn.One,
				this._panelOptions
			);
			this._panel.webview.html = ResourceReader.getWebView(this._context);
			
			this._panel.onDidDispose(() => {
				this._panel = undefined;
			});
		}
	}
	private _getWebViewHtml(pageModel: PageModel): string {
		let html = ResourceReader.getWebView(this._context);
		html = html.replace('{{originalCode}}', pageModel.originalCode);
		html = html.replace('{{language}}', pageModel.language);
		html = html.replace('{{chatReply}}', pageModel.chatReply);
		return html;
	}

	/**
	 * Get the content to show in the webview panel HTML.
	 */
	private async _getPageModel(): Promise<PageModel> {

		let pageModel: PageModel = {
			originalCode: 'No active document.',
			language: '',
			chatReply: ''
		};

		const editor = vscode.window.activeTextEditor;
		
		// ensure a document is open
		if (editor) {
			let codeLanguage: string;
			let originalCode: string;

			({ codeLanguage, originalCode } = this._getOriginalCode(editor));
			
			pageModel.language = codeLanguage;
			pageModel.originalCode = originalCode;

			// Get the chat code
			await this._getChatResponse(originalCode, codeLanguage)
				.then((chatCode) => {
					pageModel.chatReply = chatCode;
				});
		}

		return pageModel;
	}

	
	/**
	 * Get the chat response from ollama.
	 * @param originalCode The original code.
	 * @param codeLanguage The language of the original code.
	 */
	private _getChatResponse(originalCode: string, codeLanguage: string): Promise<string> {
		return new Promise((resolve, reject) => {
			let chatResponse: string = "DO NOT GOT IT";
	
			try {
				// Send a request to the chat API response
				const chatRequest: ChatRequest & { stream: false } = this._getChatPrompt(originalCode, codeLanguage);
	
				ollama.chat(chatRequest)
					.then((response) => {
						chatResponse = response.message.content;
						resolve(chatResponse);
					})
					.catch((error) => {
						console.error(error);
						reject(error);
					});
			} catch (error) {
				console.error(error);
				reject(error);
			}
		});
	}

	/**
	 * Get the chat prompt for ollama.
	 * @param originalCode The original code.
	 * @param codeLanguage The language of the original code.
	 * @returns The chat request with the original code and language.
	 */
	private _getChatPrompt(originalCode: string, codeLanguage: string): ChatRequest & { stream: false; } {
		
		const modelName: string = this._context.workspaceState.get('ec_assist.activeModel') || '';
		const promptGenerator: PromptGenerator = new PromptGenerator();		
		const prompt: ChatRequest = promptGenerator.generatePrompt(
			{
				context: this._context, 
				modelName: modelName, 
				originalCode: originalCode, 
				codeLanguage: codeLanguage
			}
		);

		return prompt as ChatRequest & { stream: false; };
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

