import { ITraceData } from './parser';

const Threshold = 500;

export const loadFileAndGatherContent = async (exceptionData: ITraceData, threshold = Threshold): Promise<any> => {
    try {
        const response = await fetch(exceptionData.url);
        const data = await response.text();
        const line = data.split('\n')[exceptionData.lineNumber - 1];
        const startColumn = Math.max(0, exceptionData.columnNumber - threshold);
        const endColumn = Math.max(threshold * 2, exceptionData.columnNumber + threshold);

        return line.substring(startColumn, endColumn).trim();
    } catch (error) {
        throw new Error(`Failed to load file: ${exceptionData.url}`);
    }
};

/*
loadFileAndGatherContent({
    url: 'https://my296.transfloeld.com/universaltruckloadservices/dist/4325.js',
    lineNumber: 1,
    columnNumber: 3280,
    module: 'https://my296.transfloeld.com/universaltruckloadservices/dist/4325.js',
    at: 'Object.getCompanyGroupsNamesLine'
}).then(console.warn);
*/