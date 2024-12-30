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
		
		codeWebViewProvider.show();
	}

}

