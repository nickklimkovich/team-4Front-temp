export const AlexPrompt = `
First, make sure that you have the most recent context of our code base.
Act as an expert JavaScript developer specializing in debugging production issues.
Your task is to analyze the following production error from an uglified JavaScript file and identify the exact location (file and line number) in the original source code where the error occurred.
Context:
Exception Message: {errorMessage}
Uglified Code Snippet: {code}
Full Stack Trace: {stackTrace}
Instructions:
Pinpoint the file path and the specific line number in the original, non-uglified source code that corresponds to the error.
Use the fact that function names, API calls, string literals, and other unique identifiers are often preserved during uglification. These are your primary clues for searching the original codebase.
Your final answer must be in the following format:
File: path/to/original/file.ts
Line: 123
Original Code Snippet: TypeScript Code`;