// a class that registers all the commands with the VS Code context
import * as vscode from 'vscode';
import { Command, 
         HelloWorldCommand, 
         ShowCodeCommand, 
         ShowModelsCommand, 
         ShowWorkspaceStateCommand 
       } from './index';

/**
 * A class that registers all the commands with the VS Code context
 */
export class CommandRegistrar {

    /**
     * Register the commands for the extension
     * @param context 
     */
    public registerCommandEvents(context: vscode.ExtensionContext): void {

        let disposable: vscode.Disposable;
        let command;
        let commands: { [key: string]: Command } = {};

        // Hello World command
        command = new HelloWorldCommand();
        commands[command.name] = command;

        // Show workspace state command
        command = new ShowWorkspaceStateCommand(context);
        commands[command.name] = command;

        // show code command
        command = new ShowCodeCommand(context);
        commands[command.name] = command;
        
        // Show Models command
        command = new ShowModelsCommand();
        commands[command.name] = command;
        
        // Register all commands with the context
        for (const commandName in commands) {
            const command = commands[commandName];
            disposable = vscode.commands.registerCommand(command.name, () => {
                command.execute();
            });
            context.subscriptions.push(disposable);
        }
    }
}