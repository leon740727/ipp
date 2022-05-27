/// <reference types="node" />
export declare function info(uri: string): Promise<printerAttributes>;
/**
 * @param uri ex. http://192.168.1.99/ipp or ipp://192.168.1.99:631/ipp
 * @param documentFormat ex. 'application/pdf'
 * @param data document of buffer type
 * @param param.docName job name
 * @param param.tray print to a specific tray
 */
export declare function print(uri: string, documentFormat: string, data: Buffer, param?: {
    docName?: string;
    jobAttributes?: Partial<jobAttributes>;
}): Promise<printResult>;
declare type jobAttributes = {
    media: string;
    'media-col': Partial<mediaCol>;
    [others: string]: primitive | primitive[] | attr | any;
};
declare type printerAttributes = {
    'printer-attributes-tag': {
        'printer-info': string;
        'media-size-supported': size[];
        'media-supported': string[];
        'media-ready': string[];
        'media-col-ready': mediaCol[];
        'media-source-supported': string[];
        'document-format-supported': string[];
    };
};
declare type printResult = {
    version: string;
    statusCode: string;
    id: number;
    'job-attributes-tag': {
        'job-id': number;
        'job-uri': string;
        'job-state': string;
        'job-state-reasons': string;
    };
};
declare type mediaCol = {
    'media-size': size;
    [others: string]: primitive | primitive[] | attr;
};
declare type size = {
    'x-dimension': number | number[];
    'y-dimension': number | number[];
};
declare type attr = {
    [field: string]: primitive | primitive[] | attr;
};
declare type primitive = string | number | boolean;
export {};
