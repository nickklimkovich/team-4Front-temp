import * as vscode from "vscode";
import { validate } from "./src/validator";
import { parseException } from "./src/parser";
import { loadFileAndGatherContent } from "./src/loader";
import { showMultilineInputBox } from "./src/multilineWindow";
import { AlexPrompt } from "./prompts/alexPrompt";

const PROMPT = AlexPrompt;

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
            const firstStackTraceItem = parsedException.trace[0];
            const file = await loadFileAndGatherContent(firstStackTraceItem);
            const message = PROMPT.replace("{errorMessage}", parsedException.exception).replace("{stackTrace}", JSON.stringify(parsedException.trace)).replace("{code}", file);
            vscode.commands.executeCommand("workbench.action.chat.openAgent", { query: `${message}`, id: "gemini" });
        } catch (error: any) {
            vscode.window.showErrorMessage(`Validation error: ${error.message}`);
            return;
        }
    };

    context.subscriptions.push(vscode.commands.registerCommand("copilot-sentry-agent.askCopilotAgent", agentCommandHandler));
}

export function deactivate() {}
