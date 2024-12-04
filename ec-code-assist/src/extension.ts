// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CommandRegistrar } from './commands/CommandRegistrar';

/**
 * This method is called when your extension is activated
 * Your extension is activated the very first time the command is executed
 * @param context: vscode.ExtensionContext
 */
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, EC Code Assist" is now active!');

	// Register the command events for the extension
	let commandRegistrar = new CommandRegistrar();
	commandRegistrar.registerCommandEvents(context);


	// Create the webview panel
	const provider = new SelectedCodeViewProvider(context.extensionUri);
	// context.subscriptions.push(vscode.window.registerWebviewViewProvider(SelectedCodeViewProvider.viewType, provider));
}

// This method is called when your extension is deactivated
export function deactivate() { }

class SelectedCodeViewProvider implements vscode.WebviewViewProvider {

	private _view?: vscode.WebviewView;

	private readonly extensionUri: vscode.Uri;
	
	public static readonly viewType = 'ec-code-assist.selectedCodeView';

	constructor(extensionUri: vscode.Uri) {
		this.extensionUri = extensionUri;
	 }

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		token: vscode.CancellationToken): Thenable<void> | void {

		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [ this.extensionUri ]
		};

		webviewView.webview.html = this.getWebviewContent();
	}

	private getWebviewContent(): string {
		return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none';">
                <title>Custom Webview</title>
            </head>
            <body>
                <h1>Hello from Webview!</h1>
 
				<p>Got it</p>
				
				</body>
            </html>`;
	}
}