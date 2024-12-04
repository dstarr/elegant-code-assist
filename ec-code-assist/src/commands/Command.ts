/**
 * The interface used for Commands
 */
export interface Command {

    // The command identifier
    name: string;

    // The command execution logic
    execute(): void;
}