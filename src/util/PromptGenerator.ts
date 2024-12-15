
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export class PromptGenerator {
    
    private readonly schema: any;

    constructor() {
        this.schema = zodToJsonSchema(this.ChatReponseSchema);;
    }

    generatePrompt(context: string): { prompt: any } {
        return {
            prompt: {}
        };
    }
    
    private ChatReponseSchema = z.object({
        overview: z.string(),
        suggestions: z.array(
            z.object({
                explanation: z.string(),
                codeExample: z.string()
            }
         ))
    });
}

