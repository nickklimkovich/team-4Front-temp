# team-4Front-tem# Copilot Agent Example Extension

This is a sample VS Code extension that demonstrates how to interact with the GitHub Copilot agent using the VS Code API.

## Features

This extension provides a command:

-   `Ask Copilot to explain selection`: Takes the currently selected code in the active editor and asks GitHub Copilot to explain it. The explanation is streamed to a new Output channel.

## Requirements

-   [Visual Studio Code](https://code.visualstudio.com/) (version 1.88 or newer)
-   [Node.js](https://nodejs.org/)
-   [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) and [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) extensions installed and configured in VS Code.

## Installation and Running for Development

1.  Clone this repository to your local machine.
2.  Navigate to the project directory:
    ```bash
    cd team-4front
    ```
3.  Install the necessary dependencies:
    ```bash
    npm install
    ```
4.  Open the project folder in Visual Studio Code.
5.  Press `F5` to open a new Extension Development Host window. This will compile and run the extension in a new VS Code instance.
6.  In the new window, open any file with code.
7.  Select a piece of code you want to be explained.
8.  Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
9.  Type `Debug UI Sentry error` and press Enter.
10. An output channel named "Copilot Explanation" will open and display the response from Copilot.

## Hints

1. Command `git clean -xdf` might speed up the process.
2. Claude Sonnet 3.7 showed itself as the most accurate model (but the slowest!)
3. Make sure to close all files in VSCode because it might confuse model's context. 
