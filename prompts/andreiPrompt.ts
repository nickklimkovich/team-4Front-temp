export const andreiPrompt = `
I have next exception:
Cause: {errorMessage}
Stack trace: {stackTrace}

I downloaded a minified JS file contains the error. I found the place using 'Line number' and 'Column number' and cut the file content to have 500 symbols before and 500 symbols after the 'Line number' and 'Column number'.
Here is the result:
{code}

Could you please help trace an error from our minified JavaScript back to the original source code?
Task:
The goal is to find the corresponding location in our project's source files.
Method:
Please search the source code for un-minified identifiers found within the snippet, such as:
Property names - the primary option
Method names - the primary option
String constants
Distinct function calls or JavaScript keywords
Rules:
1. Focus on TypeScript files first, as they are more likely to contain the original source
2. The file should contain almost all the identifiers found in the snippet

Result:
Please provide at least three potential source locations (file name and line number) that are the most.
`;
