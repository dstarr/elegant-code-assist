import { COMMANDS } from "../util/Constants";
import { Command } from "./Command";
import * as vscode from 'vscode';

export class ShowWorkspaceStateCommand implements Command {
    
    public readonly name: string = COMMANDS.SHOW_WORKSPACE_STATE;
    private readonly _context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        console.debug(`Command ${this.name} created`);
        this._context = context;
    }

    /**
     * Iterate through the workspace state and log the keys and values
     */
    execute(): void {
        const keys = this._context.workspaceState.keys();
        
        const stateContent = keys
            .map(key => {
                const value = this._context.workspaceState.get(key);
                return `${key}: ${JSON.stringify(value)}`;
            })
            .join('\n');

        // Alternatively, output to the debug console
        console.debug('Workspace State:', stateContent);
    }


}