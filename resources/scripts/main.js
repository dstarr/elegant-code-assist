window.addEventListener('message', event => {
    const message = event.data; // The json data that the extension sent
    console.log('message data:', event.data);
   
    // Handle the message
    switch (message.command) {
        case 'ollamaResponse':
            // Update the webview with the message
            const html = parseOllamaResonseToHtml(message);
            $('#ecassist_webview_chatReply').html(html);
            hljs.highlightAll();
            break;
    }

});

function parseOllamaResonseToHtml(reply, language) {

    // build the overview message using JQuery
    var $message = $('<div></div>');
        $message.append(`<p>${reply.overview}</p>`);
    
    reply.suggestions.forEach(suggestion => {
        $div = $('<div></div>');
        $div.append(`<p class="suggestion">${suggestion.explanation}</p>`);
        $div.append(`<pre><code class="${language}">${suggestion.codeExample}</code></pre>`);

        $message.append($div);
    });

    // build the detailed message using JQuery

    return $message.html();
}



