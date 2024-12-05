import * as vscode from 'vscode';

export class SelectedCodeViewProvider implements vscode.WebviewViewProvider {

	private view?: vscode.WebviewView;

	private readonly extensionUri: vscode.Uri;

	public static readonly viewType = 'ec-code-assist.selectedCodeView';

	constructor(extensionUri: vscode.Uri) {
		this.extensionUri = extensionUri;
	}

	public showCode(code: string): void {
		if (!this.view) {
			vscode.window.showErrorMessage('Selected Code Webview not found');
			return;
		}

		vscode.window.showInformationMessage('Showing selected code in Webview');

		this.view.webview.postMessage({
			command: 'alert',
			text: 'Hello from the SelectedCodeViewProvider!'
		});
	}

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		token: vscode.CancellationToken): Thenable<void> | void {

		this.view = webviewView;

		this.view.webview.options = {
			enableScripts: true,
			localResourceRoots: [this.extensionUri]
		};

		this.view.webview.html = this.getWebviewContent();

		this.view.webview.onDidReceiveMessage(message => {
			switch (message.command) {
				case 'alert':
					vscode.window.showErrorMessage(message.text);
					return;
			}
		});
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
