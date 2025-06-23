import { parseException } from "./parser";

export const validate = (rawException?: string): rawException is string => {
    if (!rawException) {
        throw new Error("No exception data provided.");
    }

    const parsed = parseException(rawException);

    if (parsed.trace.length === 0) {
        throw new Error("No stack trace found in the exception data.");
    }
    
    return true;
};
