import * as vscode from "vscode";
import ollama, { ChatRequest } from "ollama";
import { PromptGenerator } from "../util/PromptGenerator";

/**
 * Class representing a chat reply from Ollama.
 */
export class OllamaChatReply {

    public overview: string | undefined;

    public suggestions: string[] | undefined;

    /**
     * Constructor.
     * @param overview 
     * @param suggestions 
     */
    constructor(overview: string | undefined, suggestions: string[] | undefined) {
        this.overview = overview;
        this.suggestions = suggestions;
    }

    /**
     * 
     * @param unparsedReply A string that contains the raw reply from Ollama.
     * @returns {OllamaChatReply} The chat reply object.
     */
    public static fromJson(unparsedReply: string): OllamaChatReply {
        const json = JSON.parse(unparsedReply);
        return new OllamaChatReply(json.overview, json.suggestions);
    }
}

/**
 * Service for chatting with Ollama
 */
export default class OllamaChatService {

    constructor(private _context: vscode.ExtensionContext) {}

    public async chat(originalCode: string, codeLanguage: string): Promise<OllamaChatReply> {

        try {
                // Get the chat prompt
                const chatRequest: ChatRequest & { stream: false } = this._getChatPrompt(originalCode, codeLanguage);
                
				// Send a request to the chat API response
                const response = await ollama.chat(chatRequest);
                const reply = response.message.content;

                return OllamaChatReply.fromJson(reply);

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
        private _getChatPrompt(originalCode: string, codeLanguage: string): ChatRequest & { stream: false; } {
            
            const modelName: string = this._context.workspaceState.get('ec_assist.activeModel') || '';
            const promptGenerator: PromptGenerator = new PromptGenerator();		
            const prompt: ChatRequest = promptGenerator.generatePrompt(
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