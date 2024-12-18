import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';


export class ResourceReader {

    public static getSystemPrompt(context: vscode.ExtensionContext): string {
        const path: string = new FilePathGenerator().getFilePaths(context).SystemPromptPath;
        return fs.readFileSync(path, 'utf8');
    }

    public static getWebView(context: vscode.ExtensionContext): string {
        const path: string = new FilePathGenerator().getFilePaths(context).WebView;
        return fs.readFileSync(path, 'utf8');
    }

    public static getPromptJson(context: vscode.ExtensionContext): string {
        const path: string = new FilePathGenerator().getFilePaths(context).PromptJsonPath;
        return fs.readFileSync(path, 'utf8');
    }

    public static getLastChatRequest(context: vscode.ExtensionContext): string {
        const path: string = new FilePathGenerator().getFilePaths(context).LastChatRequestPath;
        return fs.readFileSync(path, 'utf8');    
    }
}

class FilePathGenerator {

    public getFilePaths(context: vscode.ExtensionContext): Record<string, string> {

        const resourcesPath = this._getResourcesPath(context);

        return {
            SystemPromptPath: path.join(resourcesPath, 'prompts', 'systemPrompt.txt'),
            PromptJsonPath: path.join(resourcesPath, 'prompts', 'promptTemplate.json'),
            LastChatRequestPath: path.join(resourcesPath, 'lastChatRequest.json'),
            WebView: path.join(resourcesPath, 'webviews', 'webView.html'),
        };
    }

    private _getResourcesPath(context: vscode.ExtensionContext): string {
        
        return vscode.Uri.file(path.join(context.extensionPath, 'src', 'resources'))
            .with({ scheme: 'vscode-resource' })
            .fsPath;
    }

}