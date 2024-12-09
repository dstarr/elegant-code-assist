// a class that registers all the commands with the VS Code context
import * as vscode from 'vscode';
import { ActivateModelCommand, Command, HelloWorldCommand, ShowCodeCommand, ShowModelsCommand } from './index';

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
    public registerCommandEvents(context: vscode.ExtensionContext): void {

        let disposable: vscode.Disposable;

        // Hello World command
        const helloWorldCommand = new HelloWorldCommand();
        disposable = vscode.commands.registerCommand(helloWorldCommand.name, () => {
            helloWorldCommand.execute();
        });
        this.commands[helloWorldCommand.name] = helloWorldCommand;
        context.subscriptions.push(disposable);

        // Show Selected Code command
        const showCodeCommand = new ShowCodeCommand(context);
        disposable = vscode.commands.registerCommand(showCodeCommand.name, () => {
            showCodeCommand.execute();
        });
        this.commands[showCodeCommand.name] = showCodeCommand;
        context.subscriptions.push(disposable);
``
        // Show Models command
        const showModelsCommand = new ShowModelsCommand();
        disposable = vscode.commands.registerCommand(showModelsCommand.name, () => {
            showModelsCommand.execute();
        });
        this.commands[showModelsCommand.name] = showModelsCommand;
        context.subscriptions.push(disposable);

        // Activate Model command
        const activateModelCommand = new ActivateModelCommand();
        disposable = vscode.commands.registerCommand(activateModelCommand.name, (item: vscode.TreeItem) => {
            activateModelCommand.execute(item);
        });
        this.commands[activateModelCommand.name] = activateModelCommand;
        context.subscriptions.push(disposable);
    }
}