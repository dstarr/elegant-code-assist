import * as vscode from 'vscode';
import { Command } from './Command';

export class ShowSelectedCodeCommand implements Command {

	public readonly name: string = 'ec-assist.showSelectedCode';

	public execute(): void {

		const panelTitle = 'Elegant Code Assist';

		const options = {
			enableScripts: true
		};

		const panel = vscode.window.createWebviewPanel(
			this.name,
			panelTitle,
			vscode.ViewColumn.One, // Editor column to show the new webview panel in.
			options
		);

		panel.webview.html = this.getWebviewContent();
	}

	getWebviewContent(): string {

		const editor = vscode.window.activeTextEditor;
		let selectedCode = '';

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			if (selection.isEmpty) {
				vscode.window.showErrorMessage('No text selected');
				selectedCode = 'No code selected';
			} else {
				selectedCode = document.getText(selection);
			}
		}

		return `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Elegant Code Assist</title>
					<style>
						body {
							font-family: Arial, sans-serif;
							margin: 20px;
							padding: 20px;
						}
							
						p {
							font-size: 16px;
							line-height: 1.5;
						}
					</style>
				</head>
				<body>
					<h1>Welcome to Elegant Code Assist</h1>
					<p>This extension has a long way to go.</p>
					
					<p>Selected code:</p>
					<code>${selectedCode}</code>
	
				</body>
				</html>
			`;
	}
}

