export const AlexPrompt = `
Act as an expert JavaScript developer specializing in debugging production issues.
Your task is to analyze the following production error from an uglified JavaScript file and identify the exact location (file and line number) in the original source code where the error occurred.

Instructions:
- Use the fact that method names, string literals, and other unique identifiers are often preserved during uglification.
- Prioritize .ts files over .js files in source code.
- Ignore unitTests folder.
- Do not show your thinking process text.
- Do not come up with our own files use only code from the workspace!!!

Context:
Exception Message: \`\`\`{errorMessage}\`\`\`
Uglified Code Snippet: \`\`\`{code}\`\`\`
Full Stack Trace: \`\`\`{stackTrace}\`\`\`

Your final answer must be in the following format:
File: path to original file.
Line: line number in the original file.
Original Code Snippet: code snippet from original file.`;