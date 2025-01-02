window.addEventListener('message', event => {
    const message = event.data; // The json data that the extension sent
    console.log('message data:', event.data);
   
    // Handle the message
    switch (message.command) {
        case 'ollamaResponse':
            // Update the webview with the message
            const html = parseOllamaResonseToHtml(message);
            $('#ecassist_webview_chatReply').html(html);
            break;
    }

});

// Example of sending a message to the extension
const vscode = acquireVsCodeApi();
vscode.postMessage({
    command: 'alert',
    text: 'Hello from the webview!'
});

function parseOllamaResonseToHtml(reply) {

    const overview = JSON.stringify(reply.overview).replace(/^"|"$/g, '');;


    // build the overview message using JQuery
    var $message = $('<div></div>');
        $message.append(`<p>${overview}</p>`);

    // build the detailed message using JQuery

    return $message.html();
}



