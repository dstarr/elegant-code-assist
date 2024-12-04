// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { Command, HelloWorldCommand, ShowSelectedCodeCommand } from './commands';

let commands: { [id: string]: Command; } = {};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, EC Code Assist" is now active!');

	registerCommandEvents(context);
}

/**
 * Register the command events for the extension
 * @param context 
 */
function registerCommandEvents(context: vscode.ExtensionContext) {

	let command: Command;

	// Hello World command
	command = new HelloWorldCommand();
	commands[command.name] = command;

	// Show Selected Code command
	command = new ShowSelectedCodeCommand();
	commands[command.name] = command;

	// iterate through the commands and register them with VS Code
	for (let key in commands) {
		let command = commands[key];
		let disposable = vscode.commands.registerCommand(command.name, () => {
			command.execute(context);
		});

		context.subscriptions.push(disposable);
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
