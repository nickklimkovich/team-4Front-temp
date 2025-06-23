import * as vscode from "vscode";

interface MultilineInputOptions {
    title?: string;
    prompt?: string;
    placeholder?: string;
    value?: string;
    rows?: number;
    cols?: number;
}

export async function showMultilineInputBox(options: MultilineInputOptions = {}): Promise<string | null> {
    return new Promise<string | null>((resolve, reject) => {
        const panel = vscode.window.createWebviewPanel("multilineInput", options.title || "Enter Text", vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true
        });

        panel.webview.html = getWebviewContent(options);

        // Handle messages from the webview
        panel.webview.onDidReceiveMessage((message: WebviewMessage) => {
            switch (message.command) {
                case "submit":
                    panel.dispose();
                    if (!message.text) {
                        reject(new Error("No text provided"));
                        return;
                    }
                    resolve(message.text);
                    break;
                case "cancel":
                    panel.dispose();
                    resolve(null); // or reject(new Error('User cancelled')) if you prefer
                    break;
            }
        });
    });
}

interface WebviewMessage {
    command: "submit" | "cancel";
    text?: string;
}

function getWebviewContent(options: MultilineInputOptions): string {
    const placeholder: string = options.placeholder || "Enter your text here...";
    const prompt: string = options.prompt || "Please enter your text:";
    const defaultValue: string = options.value || "";
    const rows: number = options.rows || 10;
    const cols: number = options.cols || 80;

    // Escape HTML to prevent XSS
    const escapeHtml = (unsafe: string): string => {
        return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    };

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Multiline Input</title>
            <style>
                body {
                    font-family: var(--vscode-font-family);
                    padding: 20px;
                    color: var(--vscode-foreground);
                    background-color: var(--vscode-editor-background);
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                }
                textarea {
                    width: 100%;
                    min-height: 200px;
                    padding: 10px;
                    border: 1px solid var(--vscode-input-border);
                    background-color: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                    font-family: var(--vscode-editor-font-family);
                    font-size: var(--vscode-editor-font-size);
                    resize: vertical;
                    box-sizing: border-box;
                }
                .button-container {
                    margin-top: 15px;
                    text-align: right;
                }
                button {
                    padding: 8px 16px;
                    margin-left: 10px;
                    border: none;
                    border-radius: 2px;
                    cursor: pointer;
                    font-size: 13px;
                }
                .submit-btn {
                    background-color: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                }
                .submit-btn:hover {
                    background-color: var(--vscode-button-hoverBackground);
                }
                .cancel-btn {
                    background-color: var(--vscode-button-secondaryBackground);
                    color: var(--vscode-button-secondaryForeground);
                }
                .cancel-btn:hover {
                    background-color: var(--vscode-button-secondaryHoverBackground);
                }
                .prompt {
                    margin-bottom: 10px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="prompt">${escapeHtml(prompt)}</div>
                <textarea 
                    id="textInput" 
                    placeholder="${escapeHtml(placeholder)}" 
                    rows="${rows}" 
                    cols="${cols}"
                    autofocus
                >${escapeHtml(defaultValue)}</textarea>
                <div class="button-container">
                    <button class="cancel-btn" onclick="cancel()">Cancel</button>
                    <button class="submit-btn" onclick="submit()">Submit</button>
                </div>
            </div>

            <script>
                const vscode = acquireVsCodeApi();
                
                function submit() {
                    const textInput = document.getElementById('textInput');
                    if (textInput instanceof HTMLTextAreaElement) {
                        const text = textInput.value;
                        vscode.postMessage({
                            command: 'submit',
                            text: text
                        });
                    }
                }
                
                function cancel() {
                    vscode.postMessage({
                        command: 'cancel'
                    });
                }

                // Handle Ctrl+Enter to submit
                document.getElementById('textInput')?.addEventListener('keydown', function(e) {
                    if (e.ctrlKey && e.key === 'Enter') {
                        submit();
                    }
                    if (e.key === 'Escape') {
                        cancel();
                    }
                });

                // Focus the textarea
                const textarea = document.getElementById('textInput');
                if (textarea instanceof HTMLTextAreaElement) {
                    textarea.focus();
                }
            </script>
        </body>
        </html>
    `;
}
