export const prompt2 = `You are an AI assistant with expertise in JavaScript and debugging.

Task: Your goal is to analyze an error and code from a minified JavaScript file, identify the precise location of the error in the original source code.

Instructions:

I will provide you with the exception message and a code snippet extracted from the minified JavaScript file, showing 500 characters before and after the point where the error occurred.
Based on the code snippet and any available clues (like function or variable names), attempt to identify the corresponding file and function in the unminified, original source code.

Please provide the following:

Error Description: {errorMessage}
Minified JavaScript Code: \`\`\`{code}\`\`\`

Your response should include:
The code snippet from the unminified file where the error occurred.
The likely location (file path and function name) in the original source code.`;