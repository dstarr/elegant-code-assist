// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Command } from './commands/command';
import { HelloWorldCommand } from './commands/helloWorldCommand';

let commands: { [id: string]: Command; } = {};

registerCommands(commands);

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ec-code-assist" is now active!');

	registerCommandEvents(context);
}

function registerCommands(commands: { [id: string]: Command; }) {

	let helloWorldCommand = new HelloWorldCommand();
	commands[helloWorldCommand.name] = helloWorldCommand;
}

/**
 * Register the command events for the extension
 * @param context 
 */
function registerCommandEvents(context: vscode.ExtensionContext) {

	let disposable: vscode.Disposable;

	// iterate through the commands and register them
	for (let key in commands) {
		let command = commands[key];
		disposable = vscode.commands.registerCommand(command.name, () => {
			command.execute(context);
		});

		context.subscriptions.push(disposable);
	}

	// register a command that pulls the code in the current editor
	disposable = vscode.commands.registerCommand('ec-code-assist.showSelectedCode', () => {

		// Get the active text editor
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;
			const text = document.getText(selection);
			vscode.window.showInformationMessage('Selected text is: ' + text);
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
