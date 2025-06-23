import * as vscode from "vscode";
import { getSentryTextIssue } from "./src/getSentryIssue";

export function activate(context: vscode.ExtensionContext) {
    const getTextFromEditor = () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage("No active text editor");
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        if (!selectedText) {
            vscode.window.showInformationMessage("No text selected");
            return;
        }
        return selectedText;
    };

    const commandHandler = async () => {
        const selectedText = getTextFromEditor();
        if (!selectedText) {
            return;
        }

        await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: "Asking Copilot...",
                cancellable: true
            },
            async (_, token) => {
                try {
                    const [model] = await vscode.lm.selectChatModels({ vendor: "copilot" });
                    if (!model) {
                        vscode.window.showErrorMessage("Could not find a Copilot language model.");
                        return;
                    }

                    const messages = [new vscode.LanguageModelChatMessage(vscode.LanguageModelChatMessageRole.User, `Explain the following code: \n\n\`\`\`\n${selectedText}\n\`\`\``)];
                    const response = await model.sendRequest(messages, {}, token);

                    let responseText = "";
                    for await (const fragment of response.text) {
                        if (token.isCancellationRequested) {
                            return;
                        }
                        responseText += fragment;
                    }

                    const doc = await vscode.workspace.openTextDocument({ content: responseText, language: "markdown" });
                    await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
                } catch (err) {
                    if (err instanceof vscode.LanguageModelError) {
                        vscode.window.showErrorMessage(err.message);
                    } else {
                        vscode.window.showErrorMessage("An unexpected error occurred.");
                    }
                }
            }
        );
    };

    const agentCommandHandler = async () => {
        const selectedText = await getSentryTextIssue();
        if (!selectedText) {
            return;
        }

        const prompt = `Explain the following code: \n\n\`\`\`\n${selectedText}\n\`\`\``;
        vscode.commands.executeCommand("workbench.action.chat.openAgent", { query: `${prompt}`, id: "gemini-2.5-pro" });
    };

    context.subscriptions.push(vscode.commands.registerCommand("copilot-agent-example.askCopilot", commandHandler));

    context.subscriptions.push(vscode.commands.registerCommand("copilot-agent-example.askCopilotAgent", agentCommandHandler));
}

export function deactivate() {}
