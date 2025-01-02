import * as vscode from "vscode";
import ollama, { ChatRequest } from "ollama";
import { PromptBuilder } from "./PromptBuilder";
import { STATE_MANAGEMENT } from "../util/Constants";

/**
 * Class representing a chat reply from Ollama.
 */
export class OllamaChatReply {

    public readonly overview: string
    public readonly suggestions: Suggestion[];
    public readonly language: string;

    /**
     * Constructor.
     * @param overview 
     * @param suggestions 
     */
    constructor(overview: string, suggestions: Suggestion[], language: string) {
        this.overview = overview;
        this.suggestions = suggestions;
        this.language = language;
    }

    /**
     * 
     * @param unparsedReply A string that contains the raw reply from Ollama.
     * @returns {OllamaChatReply} The chat reply object.
     */
    public static fromJson(unparsedReply: string, language: string): OllamaChatReply {
        const json = JSON.parse(unparsedReply);
        
        if (!json.overview || !json.suggestions) {
            throw new Error("Invalid reply format");
        }

        return new OllamaChatReply(json.overview, json.suggestions, language);
    }
}

interface Suggestion {
    exmplanation: string;
    codeExample: string;
}

/**
 * Service for chatting with Ollama
 */
export default class OllamaChatService {

    constructor(private _context: vscode.ExtensionContext) { }

    /**
     * Talk to the Ollama chat protocol 
     * @param originalCode 
     * @param codeLanguage 
     * @returns { Promise<OllamaChatReply> } The chat reply from Ollama.
     */
    public async chat(codeLanguage: string, originalCode: string): Promise<OllamaChatReply> {

        try {
            // Get the chat prompt
            const chatRequest: ChatRequest & { stream: false } = this._getChatPrompt(codeLanguage, originalCode);

            // Send a request to the chat API response
            const response = await ollama.chat(chatRequest);
            const reply = response.message.content;

            console.debug("Ollama response: " + reply);

            // Parse the reply into an OllamaChatReply object
            return OllamaChatReply.fromJson(reply, codeLanguage);

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * Get the chat prompt for ollama.
     * @param originalCode The original code.
     * @param codeLanguage The language of the original code.
     * @returns The chat request with the original code and language.
     */
    private _getChatPrompt(codeLanguage: string, originalCode: string): ChatRequest & { stream: false; } {

        const modelName: string = this._context.workspaceState.get<string>(STATE_MANAGEMENT.WORKSPACE_STATE_ACTIVE_MODEL) || '';
        const promptBuilder: PromptBuilder = new PromptBuilder();
        const prompt: ChatRequest = promptBuilder.generatePrompt(
            {
                context: this._context,
                modelName: modelName,
                originalCode: originalCode,
                codeLanguage: codeLanguage
            }
        );

        return prompt as ChatRequest & { stream: false; };
    }
}