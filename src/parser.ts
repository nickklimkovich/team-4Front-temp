export interface ITraceData {
    url: string;
    lineNumber: number;
    columnNumber: number;
}

interface IExceptionData {
    prompt: string;
    exception: string;
    trace: ITraceData[];
}

const ParsingError = new Error('Failed to parse exception trace. Please ensure the format is the following:\n\n' +
    'Cause: EX_ID: Exception text\n\n' +
    'URL\n\n' +
    'Line number: number\n\n' +
    'Column number: number\n\n' +
    'Stack trace: \n\n' +
    '//======StackTrace=======\n' +
    '[{"url":"string","lineNumber":"number","columnNumber":"number"}, ...]'
);

export const parseException = (traceStr: string): IExceptionData => {
    const [_, stackTrace] = traceStr.split("//======StackTrace=======");
    if (!stackTrace) {
        throw ParsingError;
    }

    let parsedStackTrace: ITraceData[] = [];
    try {
       parsedStackTrace = JSON.parse(stackTrace.trim());
    } catch (e) {
        throw ParsingError;
    }

    const exception = traceStr.split('\n')[0].replace('Cause: ', '').trim();
    return {trace: parsedStackTrace, prompt: traceStr, exception };
}

/*
console.log(parseException(`Cause: EX8B75FD73: Cannot read properties of undefined (reading 'companyGroups')

https://my296.transfloeld.com/universaltruckloadservices/dist/4325.js

Line number: 1

Column number: 3280

Stack trace: 

//======StackTrace=======
[{"url":"https://my296.transfloeld.com/universaltruckloadservices/dist/4325.js","lineNumber":1,"columnNumber":3280,"module":"https://my296.transfloeld.com/universaltruckloadservices/dist/4325.js","at":"Object.getCompanyGroupsNamesLine"},{"url":"https://my296.transfloeld.com/universaltruckloadservices/dist/2032.js","lineNumber":1,"columnNumber":56707,"module":"https://my296.transfloeld.com/universaltruckloadservices/dist/2032.js","at":"q"},{"url":"https://my296.transfloeld.com/universaltruckloadservices/dist/2032.js","lineNumber":1,"columnNumber":56793,"module":"https://my296.transfloeld.com/universaltruckloadservices/dist/2032.js","at":"H"},{"url":"https://my296.transfloeld.com/universaltruckloadservices/dist/2032.js","lineNumber":1,"columnNumber":56839,"module":"https://my296.transfloeld.com/universaltruckloadservices/dist/2032.js","at":"o"},{"url":"https://my296.transfloeld.com/universaltruckloadservices/dist/5351.js","lineNumber":1,"columnNumber":11451,"module":"https://my296.transfloeld.com/universaltruckloadservices/dist/5351.js","at":"Object.provideAddressOnDemand"},{"url":"https://my296.transfloeld.com/universaltruckloadservices/dist/2032.js","lineNumber":1,"columnNumber":56978,"module":"https://my296.transfloeld.com/universaltruckloadservices/dist/2032.js","at":""},{"url":"https://my296.transfloeld.com/universaltruckloadservices/dist/2032.js","lineNumber":1,"columnNumber":57056,"module":"https://my296.transfloeld.com/universaltruckloadservices/dist/2032.js","at":""},{"url":"https://my296.transfloeld.com/universaltruckloadservices/dist/2032.js","lineNumber":1,"columnNumber":56848,"module":"https://my296.transfloeld.com/universaltruckloadservices/dist/2032.js","at":"Q"},{"url":"https://my296.transfloeld.com/universaltruckloadservices/dist/2032.js","lineNumber":1,"columnNumber":60290,"module":"https://my296.transfloeld.com/universaltruckloadservices/dist/2032.js","at":"Object.drawLiveVehicle"}]`));
*/