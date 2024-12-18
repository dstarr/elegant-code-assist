
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import fs from 'fs';
import { ChatRequest } from 'ollama';
import * as vscode from 'vscode';
import path from 'path';
import { ResourceReader } from './ResourceReader';

/**
 * Class to generate the prompt for the chat request.
 */
export class PromptGenerator {
    
    private readonly _schema: any;

    constructor() {
        this._schema = zodToJsonSchema(ChatReponseSchema);
    }

    /**
     * Create a prompt for the chat request.
     * @param context {vscode.ExtensionContext} The extension context.
     * @returns {prompt: ChatRequest} The chat request.
     */
    generatePrompt(context: vscode.ExtensionContext, modelName: string, originalCode: string, codeLanguage: string): ChatRequest {

        const systemPrompt: string = ResourceReader.getSystemPrompt(context);
        
        let chatRequest: string = ResourceReader.getPromptJson(context);
        
        chatRequest = chatRequest.replace("{{modelName}}", modelName);
        chatRequest = chatRequest.replace("{{language}}", codeLanguage);
        chatRequest = chatRequest.replace("\"{{code}}\"", JSON.stringify(originalCode));
        chatRequest = chatRequest.replace("\"{{systemPrompt}}\"", JSON.stringify(systemPrompt));
        chatRequest = chatRequest.replace("\"{{schema}}\"", JSON.stringify(this._schema));
    
        return JSON.parse(chatRequest) as ChatRequest;

    }
}

/**
 * The schema for the chat response
 */
const ChatReponseSchema = z.object({
    overview: z.string(),
    suggestions: z.array(
        z.object({
            explanation: z.string(),
            codeExample: z.string()
        }
     ))
});
