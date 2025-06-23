import * as vscode from 'vscode';

/**
 * A simpler approach to collect Sentry issues using the chat input box
 */
export async function getSentryIssueViaChat(): Promise<string | undefined> {
    // Open the native VS Code input box styled as a chat input
    return vscode.window.showInputBox({
        placeHolder: "Please provide information about the Sentry issue.",
        prompt: "Sentry Issue Information",
        ignoreFocusOut: true
    });
}
