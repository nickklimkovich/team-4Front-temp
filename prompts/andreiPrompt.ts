export const andreiPrompt = `
I have next exception:
Cause: {errorMessage}
Stack trace:
{stackTrace}

I downloaded a minified JS file contains the error. I found the place using 'Line number' and 'Column number' and cut the file content to have 500 symbols before and 500 symbols after the 'Line number' and 'Column number'.
Here is the result:
{code}

Step 1:
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

Please provide at least three potential source locations (file name and line number) that are the most. Then go through the 3 files and find the best file where the file content mostly identical to the provided snippet of the minified code. Let's use the most promising candidate file and try to find the line where the error I prodived can happend.

Mandatory:
1)DO NOT TRY TO FIX THE ERROR WHILE YOU GET SUCH APPROVAL!
2) DO NOT SHOW THINKING TEXT. JUST SHOW ME THE RESULT. USE EXAMPLE BELOW:

Result example:
The most likely place for this error to originate in distributionListEditor.ts is within the addRecipientHandler function:
File: distributionListEditor.ts
Line: Around 1435 (inside addRecipientHandler function)
\`\`\`JavaScript
addRecipientHandler = function (recipientType: string, recipient, lockTemplatesObj: boolean) {
    var params = recipientKinds[recipientType]; // <--- If recipientKinds[recipientType] is undefined, 'params' will be undefined.

    inlineSaveMessage && inlineSaveMessage.hideMessages();

    if (params.length === 0) { // <--- This would throw "Cannot read properties of undefined (reading 'length')" if params is undefined.
        addInternalRecipient({ recipientType }).then(function () {
            eventsHandler.fireEvent("onChange", this, []);
            renderRecipients();
        });
    } else {
        addRecipientForm && addRecipientForm.cancel();
        morePopupWindow.close();
        addRecipientForm = addForm(container as HTMLElement, recipientType, recipient, addRecipient, lockTemplatesObj);
    }
},
\`\`\`
`;
