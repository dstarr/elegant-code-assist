// a class that registers all the commands with the VS Code context
import * as vscode from 'vscode';
import { Command, HelloWorldCommand, ShowSelectedCodeCommand } from './index';

/**
 * A class that registers all the commands with the VS Code context
 */
export class CommandRegistrar {

    public commands: { [id: string]: Command; } = {};

    constructor() {
        this.commands = {};
    }

    /**
     * Register the command events for the extension
     * @param context 
     */
    public registerCommandEvents(context: vscode.ExtensionContext) {
        let command: Command;

        // Hello World command
        command = new HelloWorldCommand();
        this.commands[command.name] = command;

        // Show Selected Code command
        command = new ShowSelectedCodeCommand();
        this.commands[command.name] = command;

        // iterate through the commands and register them with VS Code
        for (let key in this.commands) {
            let command = this.commands[key];
            let disposable = vscode.commands.registerCommand(command.name, () => {
                command.execute(context);
            });

            context.subscriptions.push(disposable);
        }
    }
}