import * as vscode from "vscode";
import { validate } from "./src/validator";
import { parseException } from "./src/parser";
import { loadFileAndGatherContent } from "./src/loader";
import { showMultilineInputBox } from "./src/multilineWindow";
import { andreiPrompt, nextPrompt } from "./prompts/andreiPrompt";

const PROMPT = andreiPrompt;
const NEXT_PROMPT = nextPrompt;

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
            
            while (currentTraceIndex < parsedException.trace.length) {
                const currentStackTraceItem = parsedException.trace[currentTraceIndex];
                const file = await loadFileAndGatherContent(currentStackTraceItem);
                
                const promptTemplate = currentTraceIndex === 0 ? PROMPT : NEXT_PROMPT;
                const message = promptTemplate.replace("{errorMessage}", parsedException.exception)
                    .replace("{stackTrace}", JSON.stringify([currentStackTraceItem])) // Only use the current stack trace item
                    .replace("{code}", file);
                
                // Create a status bar item to show processing status
                const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
                statusBarItem.text = "$(sync~spin) Processing stack trace item...";
                statusBarItem.show();
                
                // Send current stack trace item to chat agent
                try {
                    // First, open the chat with the query
                    await vscode.commands.executeCommand("workbench.action.chat.openAgent", { query: `${message}`, id: "gemini" });
                    
                    // Create a status bar item that will remain visible until the user clicks it
                    const continueButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
                    continueButton.text = "$(check) Continue Sentry Analysis";
                    continueButton.tooltip = "Click when Copilot has finished analyzing the stack trace";
                    continueButton.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
                    continueButton.show();
                    
                    // Wait for user to click the continue button
                    await new Promise<void>((resolve) => {
                        // Register a temporary command to handle the continue button click
                        const tempCommandId = `_copilot-sentry-agent.continue-${Date.now()}`;
                        const commandDisposable = vscode.commands.registerCommand(tempCommandId, () => {
                            resolve();
                        });
                        
                        // Set the button to trigger our command
                        continueButton.command = tempCommandId;
                        
                        // Also show a notification
                        vscode.window.showInformationMessage(
                            "Review Copilot's analysis, then click 'Continue Sentry Analysis' in the status bar to proceed.",
                            "OK"
                        );
                        
                        // Clean up if the window is closed
                        context.subscriptions.push(commandDisposable);
                    });
                    
                    // Dispose of the button when done
                    continueButton.dispose();
                    
                    // Hide the status bar item
                    statusBarItem.hide();
                    statusBarItem.dispose();
                    
                    // Check if there are more stack trace items
                    if (currentTraceIndex < parsedException.trace.length - 1) {
                        // Ask if the user wants to continue to the next stack trace item
                        const nextItem = parsedException.trace[currentTraceIndex + 1];
                        const userChoice = await vscode.window.showInformationMessage(
                            `Would you like to proceed with the next stack trace item? (${nextItem.url}, line ${nextItem.lineNumber})`,
                            'Yes', 'No'
                        );
                        
                        if (userChoice === 'Yes') {
                            currentTraceIndex++;
                        } else {
                            break; // Exit the loop if the user chooses 'No'
                        }
                    } else {
                        break; // Exit the loop if there are no more stack trace items
                    }
                } catch (error) {
                    statusBarItem.hide();
                    statusBarItem.dispose();
                    throw error;
                }
            }
            
        } catch (error: any) {
            vscode.window.showErrorMessage(`Validation error: ${error.message}`);
            return;
        }
    };

    context.subscriptions.push(vscode.commands.registerCommand("copilot-sentry-agent.askCopilotAgent", agentCommandHandler));
}

export function deactivate() {}
