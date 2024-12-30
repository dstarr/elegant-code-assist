import * as vscode from 'vscode';
import { STATE_MANAGEMENT, VIEWS } from '../util/Constants';
import HtmlBuilder, { PageModel } from '../services/HtmlBuilder';

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

    public show() {
        
        if (this._panel) {
            this._panel.webview.html = this._getOpeningHtml();
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

            this._panel.webview.html = this._getOpeningHtml();

            this._panel.onDidDispose(() => {
                this._panel = undefined;
            });
        }
    }

    public addOllamaResponse(): void {
        if (this._panel) {
			this._panel.webview.postMessage({ type: 'codeAiResponse' });
		}
    }

    private _getOpeningHtml(): string {

        const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
        
        if (!editor) {
            return "<H1>NO OPEN EDITOR</H1>";
        }

        // Get the original code from the active document
		const { codeLanguage, originalCode } = this._getOriginalCode(editor);

        // make a model from the information we've collected
        const pageModel = this._getPageModel(codeLanguage, originalCode);
        
        // get the html to show in the webview panel
        const htmlBuilder: HtmlBuilder = new HtmlBuilder(this._context);
        return htmlBuilder.getWebViewHtml(pageModel);
    }

    public dispose(): void {
        console.debug("Disposing webview");
    }

/**
     * Get the original code from the active document.
     * Values can be:
     * - The selected text if any.
     * - The entire document text if no text is selected.
     * @param editor The active text editor.
     */
    private _getOriginalCode(editor: vscode.TextEditor): { codeLanguage: string; originalCode: string; } {

        let code: string = "No active document.";
        let codeLanguage: string = '';

        const document = editor.document;
        if (!document) {
            return { codeLanguage, originalCode: code };
        }

        const selection = editor.selection;
        codeLanguage = editor.document.languageId;

        // Get the selected text if any, otherwise, get the entire document text
        if (selection.isEmpty) {
            code = document.getText();
        } else {
            code = document.getText(selection);
        }
        return { codeLanguage, originalCode: code };
    }

    /**
     * Get the content to show in the webview panel HTML
     */
    private _getPageModel(codeLanguage: string, originalCode: string): PageModel {

        return {
            model: this._context.workspaceState.get<string>(STATE_MANAGEMENT.WORKSPACE_STATE_ACTIVE_MODEL) || '',
            originalCode: originalCode,
            language: codeLanguage
        };
    }


}