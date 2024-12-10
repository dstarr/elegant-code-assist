// a class that registers all the commands with the VS Code context
import * as vscode from 'vscode';
import { HelloWorldCommand, ShowCodeCommand, ShowModelsCommand } from './index';

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

        // Hello World command
        const helloWorldCommand = new HelloWorldCommand();
        disposable = vscode.commands.registerCommand(helloWorldCommand.name, () => {
            helloWorldCommand.execute();
        });
        context.subscriptions.push(disposable);

        // Show Selected Code command
        const showCodeCommand = new ShowCodeCommand(context);
        disposable = vscode.commands.registerCommand(showCodeCommand.name, () => {
            showCodeCommand.execute();
        });
        context.subscriptions.push(disposable);

        // Show Models command
        const showModelsCommand = new ShowModelsCommand();
        disposable = vscode.commands.registerCommand(showModelsCommand.name, () => {
            showModelsCommand.execute();
        });
        context.subscriptions.push(disposable);
    }
}