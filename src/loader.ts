import { ITraceData } from './parser';

const Threshold = 500;

interface IFileContent {
    file: string;
    place: string;
    before: number;
    after: number;
}

export const loadFileAndGatherContent = async (exceptionData: ITraceData, threshold = Threshold): Promise<IFileContent> => {
    try {
        const response = await fetch(exceptionData.url);
        const data = await response.text();
        const line = data.split('\n')[exceptionData.lineNumber - 1];
        const col = exceptionData.columnNumber - 1;
        const startColumn = Math.max(0, col - threshold);
        const endColumn = Math.max(threshold * 2, col + threshold);

        return {file: line.substring(startColumn, endColumn).trim(), place: line.substring(col, col + 10).trim(), before: col - startColumn, after: endColumn - col};
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