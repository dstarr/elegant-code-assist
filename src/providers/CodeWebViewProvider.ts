import * as vscode from 'vscode';
import { STATE_MANAGEMENT, VIEWS } from '../util/Constants';
import HtmlBuilder, { PageModel } from '../services/HtmlBuilder';
import OllamaChatService, { OllamaChatReply } from '../services/OllamaChatService';

export class CodeWebViewProvider implements vscode.WebviewViewProvider {

    private _panel: vscode.WebviewPanel | undefined;
    private readonly _context: vscode.ExtensionContext;

    static viewType: string = VIEWS.CODE_VIEW;

    constructor(context: vscode.ExtensionContext) {
        this._context = context;
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        token: vscode.CancellationToken): Thenable<void> | void {

        console.debug("Resolving webviewView");
    }

    public show(codeLanguage: string, originalCode: string) {

        console.debug("Showing webview");

        if (this._panel) {
            this._panel.webview.html = this._getOpeningHtml(codeLanguage, originalCode);
            this._panel.reveal();
        } else {
            this._panel = vscode.window.createWebviewPanel(
                VIEWS.CODE_VIEW,
                'Elegant Code Assist',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: false,
                }
            );

            this._panel.webview.html = this._getOpeningHtml(codeLanguage, originalCode);

            // Handle messages from the webview
            this._panel.webview.onDidReceiveMessage((message) => {
                  console.debug("Received message from webview:", message);
                },
                undefined,
                this._context.subscriptions
            );

            this._panel.onDidDispose(() => {
                this._panel = undefined;
            });


        }

        this._addOllamaResponse(originalCode, codeLanguage);
    }

    private _addOllamaResponse(codeLanguage: string, originalCode: string): void {

        console.debug("Getting Ollama response");

        // get the response from ollama
        const ollamaChatService = new OllamaChatService(this._context);

        ollamaChatService.chat(originalCode, codeLanguage)
            .then((reply: OllamaChatReply) => {

                if (!this._panel) {
                    console.debug("No panel to post to");
                    return;
                }

                console.log("Posting Ollama response to panel");

                // send the webpanel a message
                this._panel.webview.postMessage({
                    command: 'ollamaResponse',
                    overview: reply.overview,
                    suggestions: reply.suggestions
                });

            })
            .catch((error: any) => {
                console.error(error);
            });

    }

    private _getOpeningHtml(codeLanguage: string, originalCode: string): string {

        const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;

        if (!editor) {
            return "<H1>NO OPEN EDITOR</H1>";
        }

        // get the html to show in the webview panel
        const htmlBuilder: HtmlBuilder = new HtmlBuilder(this._context);
        const webView: vscode.Webview | undefined = this._panel?.webview;
        const pageModel: PageModel = this._getPageModel(codeLanguage, originalCode);

        if (webView) {
            return htmlBuilder.getWebViewHtml(pageModel, webView);
        }
        else {
            return '<h1>NO WEBVIEW</h1>';
        }
    }

    public dispose(): void {
        console.debug("Disposing webview");
    }

    /**
     * Get the content to show in the webview panel HTML
     */
    private _getPageModel(codeLanguage: string, originalCode: string): PageModel {

        return {
            model: this._context.workspaceState.get<string>(STATE_MANAGEMENT.WORKSPACE_STATE_ACTIVE_MODEL) || '',
            originalCode: originalCode,
            language: codeLanguage,
            webviewCspSource: this._panel?.webview.cspSource || ''
        };
    }


}