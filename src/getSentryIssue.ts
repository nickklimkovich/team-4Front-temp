import * as vscode from "vscode";

export async function getSentryTextIssue () {
    const result = await vscode.window.showInputBox({
        placeHolder: "Please provide information about the Sentry issue."
    });

    return result;
}