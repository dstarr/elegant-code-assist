import * as vscode from 'vscode';
import { ResourceReader } from "../util/ResourceReader";

/**
 * Interface for passing the code to show in the webview panel.
 */
export interface PageModel {
    model: string;
    originalCode: string;
    language: string;
    webviewCspSource: string;
}

/**
 * Class to build the HTML for the chat reply.
 */
export default class HtmlBuilder {

    private readonly _context: vscode.ExtensionContext;

    /**
     * Constructor.
     * @param context The extension context.
     */
    constructor(context: vscode.ExtensionContext) {
        this._context = context;
    }

    public getHtmlForShowCodeWebviewPanel(webview: vscode.Webview) {

        const extensionUri = this._context.extensionUri;

        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'main.js'));

        // Do the same for the stylesheet.
        const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'reset.css'));
        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'vscode.css'));
        const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'main.css'));

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
    
                    <!--
                        Use a content security policy to only allow loading styles from our extension directory,
                        and only allow scripts that have a specific nonce.
                        (See the 'webview-sample' extension sample for img-src content security policy examples)
                    -->
                    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
    
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
                    <link href="${styleResetUri}" rel="stylesheet">
                    <link href="${styleVSCodeUri}" rel="stylesheet">
                    <link href="${styleMainUri}" rel="stylesheet">
    
                    <title>Cat Colors</title>
                </head>
                <body>
                    <ul class="color-list">
                    </ul>
    
                    <button class="add-color-button">Add Color</button>
    
                    <script nonce="${nonce}" src="${scriptUri}"></script>
                </body>
                </html>`;
    }

    /**
     * Take in a pageModel and return the HTML to show in the webview panel.
     * @param { PageModel } pageModel 
     * @returns 
     */
    public getWebViewHtml(pageModel: PageModel): string {

        // make the token replacements in the chat response
        let html = ResourceReader.getWebView(this._context);

        html = html.replace('{{model}}', pageModel.model);
        html = html.replace('{{originalCode}}', pageModel.originalCode);
        html = html.replace('{{language}}', pageModel.language);
        html = html.replace('{{webviewCspSource}}', pageModel.webviewCspSource);
        html = html.replace('{{nonce}}', getNonce());

        return html;
    }


}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}