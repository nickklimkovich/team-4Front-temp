export const prompt1 = `
I have next exception in the project: {errorMessage},
Here is a stack trace: {stackTrace}
This is part of the minified javascript file. It was cut to have 500 symbols before and after the "Line number" and "Column number" in the stack trace.
Try to find real file and place in the project where this error can happen. Look for the typescript files.`;