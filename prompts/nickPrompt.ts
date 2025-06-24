const generalStates = `
Act as an expert JavaScript developer specializing in debugging production issues.
`;

const outputInstructions = `
**Instructions:**

1.  **Analyze the Clues:** Carefully examine the minified code snippet and the stack trace. Look for clues that might be present in the original source code. Function names, variable names, string literals, and API call patterns are often preserved or only slightly changed during minification and are your best clues.

2.  **Search the Source Code:** Use the identified clues to search the entire codebase (current open folder in the workspace). Prioritize your search on TypeScript (\`.ts\`) files, as these are the most likely source. Do not generate code that is not existed in the original codebase.

3.  **Identify the Location:** Pinpoint the file path and the specific line number in the original, non-uglified source code that corresponds to the error. The correct file should logically contain the identifiers and patterns found in the minified snippet. It should match the stack trace wich was provided (the next stack trace item should call previous one).

4.  **Provide the Result:** Present your findings clearly.

**Important Rules:**
- DO NOT attempt to fix the error. Your only task is to identify the source location.
- Present only the final result without any conversational text or thought process.

**Output Format:**

The most likely place for this error is:

**File:** \`path/to/original/file.ts\`
**Function:** \`functionName\`
**Line:** \`lineNumber\`

**Original Code Snippet:**
\`\`\`typescript
// A snippet of the original code with the likely error line indicated.
// ... surrounding code ...
const problematicLine = some.code.that.causes.the.error; // <--- Potential error location
// ... surrounding code ...
\`\`\`

Provide the same output for each stack trace item.
`;

const sentryPromptContext = `
**Context:**
- **Error Message:** {errorMessage}
- **Stack Trace:** {stackTrace}
- **Minified Code Snippets for the stack trace items:**
{code}
`;

export const nickPrompt = `
${generalStates}

Your task is to analyze the following production error, which includes a stack trace and a snippet from a minified JavaScript file. Your goal is to identify the exact location (file path, line number, and function) in the original, unminified source code where the error occurred.

${sentryPromptContext}

${outputInstructions}
`;

export const stackTraceItem = `      
Stack Trace Item #{index}:
\`\`\`javascript
{code}
\`\`\`
(The code snippet is extracted from the minified file, showing {before} characters before the exact error place and {after} characters after the exact error place)
The excact place starts at symbols:
\`\`\`javascript
{codePlace}
\`\`\`            
`
