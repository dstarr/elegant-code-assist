window.addEventListener('message', event => {
    const message = event.data; // The json data that the extension sent
    console.log('message data:', event.data);
});

// Example of sending a message to the extension
const vscode = acquireVsCodeApi();
vscode.postMessage({
    command: 'alert',
    text: 'Hello from the webview!'
});