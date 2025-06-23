import * as vscode from "vscode";

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "copilot-agent-example" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand("copilot-agent-example.askCopilot", async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage("Open a file and select some code to ask Copilot about.");
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        if (!selectedText) {
            vscode.window.showInformationMessage("Select some code to ask Copilot about.");
            return;
        }

        try {
            // Get the Copilot chat participant
            let copilotParticipant: vscode.ChatParticipant | undefined;
            try {
                copilotParticipant = vscode.chat.createChatParticipant("copilot", (req, context, response, cancellationToken) => {
                    // This function is called when Copilot sends a response
                    response.on("data", data => {
                        // Handle the data received from Copilot
                        console.log(`Received data from Copilot: ${data}`);
                    });
                });
            } catch (e) {
                copilotParticipant = undefined;
            }
            if (!copilotParticipant) {
                vscode.window.showErrorMessage("Copilot participant not found. Please make sure GitHub Copilot Chat is installed and enabled.");
                return;
            }

            // Create a request to send to Copilot
            const request = new vscode.ChatRequest([{ role: vscode.ChatMessageRole.User, content: `Explain the following code:\n\`\`\`\n${selectedText}\n\`\`\`` }], {}, copilotParticipant);

            // Create an output channel to stream the response
            const outputChannel = vscode.window.createOutputChannel("Copilot Explanation");
            outputChannel.show();
            outputChannel.appendLine("Asking Copilot to explain the selected code...");
            outputChannel.appendLine("---");

            // Send the request and handle the stream of response fragments
            const responseStream = vscode.chat.sendRequest(request, {}, new vscode.CancellationTokenSource().token);

            for await (const responseFragment of responseStream) {
                outputChannel.append(responseFragment.content);
            }

            outputChannel.appendLine("\n---");
            outputChannel.appendLine("Copilot response finished.");
        } catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`Error interacting with Copilot: ${error.message}`);
            } else {
                vscode.window.showErrorMessage("An unknown error occurred while interacting with Copilot.");
            }
        }
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
