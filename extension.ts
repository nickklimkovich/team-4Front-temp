import * as vscode from "vscode";
import { validate } from "./src/validator";
import { parseException } from "./src/parser";
import { loadFileAndGatherContent } from "./src/loader";
import { showMultilineInputBox } from "./src/multilineWindow";
import { nickPrompt, stackTraceItem } from "./prompts/nickPrompt";

const PROMPT = nickPrompt;

export function activate(context: vscode.ExtensionContext) {
    
    const agentCommandHandler = async () => {
        const selectedText =
            (await showMultilineInputBox({
                title: "Please provide information about the Sentry issue."
            })) ?? "";

        try {
            if (!validate(selectedText)) {
                return;
            }
            const parsedException = parseException(selectedText);
            
            // Process stack trace items one by one, offering to continue to next item
            let currentTraceIndex = 0;

            const stackTraceFiles = await Promise.all(parsedException.trace.map(item => loadFileAndGatherContent(item)));
            
            const promptFileItems = stackTraceFiles.map((item, index) => {
                const {file, place, before, after } = item;
                return stackTraceItem
                    .replace("{index}", (index + 1).toString())
                    .replace("{code}", file)
                    .replace("{codePlace}", place)
                    .replace("{before}", before.toString())
                    .replace("{after}", after.toString());
            }).join("\n");

            const message = PROMPT.replace("{errorMessage}", parsedException.exception)
                    .replace("{stackTrace}", JSON.stringify(parsedException.trace))
                    .replace("{code}", promptFileItems)
                    .replace(/\{step\}/g, (currentTraceIndex + 1).toString());

            try {
                // First, open the chat with the query
                await vscode.commands.executeCommand("workbench.action.chat.openAgent", { query: `${message}`, id: "gemini" });
            } catch (error) {
                throw error;
            }
            
        } catch (error: any) {
            vscode.window.showErrorMessage(`Validation error: ${error.message}`);
            return;
        }
    };

    context.subscriptions.push(vscode.commands.registerCommand("copilot-sentry-agent.askCopilotAgent", agentCommandHandler));
}

export function deactivate() {}
