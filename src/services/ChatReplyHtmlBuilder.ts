import * as vscode from 'vscode';
import { ResourceReader } from "../util/ResourceReader";

/**
 * Interface for passing the code to show in the webview panel.
 */
export interface PageModel {
    model: string;
    originalCode: string;
    language: string;
}

/**
 * Class to build the HTML for the chat reply.
 */
export default class ChatReplyHtmlBuilder {

    private readonly _context: vscode.ExtensionContext;

    /**
     * Constructor.
     * @param context The extension context.
     */
    constructor(context: vscode.ExtensionContext) {
        this._context = context;
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
        

        return html;
    }

        // structure the chat reply in HTML
        // let chatReplyHtml = '';
        // if (pageModel.chatReply) {

        //     const chatReply = JSON.parse(pageModel.chatReply);

        //     if (!chatReply) {
        //         chatReplyHtml = `<div class="chat-reply">No message to report</div>`;
        //     } else {
        //         chatReplyHtml = `<div class="chat-reply">`;
        //         chatReplyHtml += `<div class="chat-reply__overview">${chatReply.overview}</div>`;
        //         chatReplyHtml += `<div class="chat-reply__suggestions">`;
        //         chatReply.suggestions.forEach((suggestion: any) => {
        //             chatReplyHtml += `<div class="chat-reply__suggestion">
        //                                 <div class="chat-reply__suggestion__explanation">${suggestion.explanation}</div>
        //                                 <div class="chat-reply__suggestion__codeExample">
        //                                     <pre><code class="${pageModel.language}">${suggestion.codeExample}</code></pre>
        //                                 </div>
        //                               </div>`;
        //         });
        //         chatReplyHtml += `</div></div>`;
        //     }
        // }

}