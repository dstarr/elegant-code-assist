import * as vscode from 'vscode';
import { Command } from './Command';
import { COMMANDS } from '../util/Constants';
import { CodeWebViewProvider } from '../providers';

/**
 * Command to show the code in a webview panel.
 */
export class SendCodeCommand implements Command {

	// The extension context
	private readonly _context: vscode.ExtensionContext;

	/**
	 * This is the command identifier that the command is registered with.
	 */
	public name: string = COMMANDS.SEND_CODE;

	/**
	 * Constructor.
	 * @param context The extension context.
	 */
	constructor(context: vscode.ExtensionContext) {
		console.debug(`Command ${this.name} created`);
		this._context = context;
	}

	/**
	 * Called when the command is executed.
	 */
	public execute(): void {
		
		// create a webview panel provider
		console.debug(`Command ${this.name} executed`);

		const codeWebViewProvider: CodeWebViewProvider = new CodeWebViewProvider(this._context);
		
		this._context.subscriptions.push(
			vscode.window.registerWebviewViewProvider(CodeWebViewProvider.viewType, codeWebViewProvider)
		);
		
		// get the active text editor
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage("No active document.");
			return;
		}

		// get the original code from the active document
		const { codeLanguage, originalCode } = this._getOriginalCode(editor);

		codeWebViewProvider.show(originalCode, codeLanguage);
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

