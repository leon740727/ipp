declare module 'ipp' {
    export type operation = 'Get-Printer-Attributes' | 'Print-Job';

    type attr = { [field: string]: primitive | primitive[] | attr };
    export type msg = {
        'operation-attributes-tag': attr,
        'job-attributes-tag'?: Partial<jobAttributes>,
        data?: Buffer,
    }

    export function Printer (uri: string): {
        execute: (operation: operation, msg: msg, callback: callback) => void,
    }

    export function serialize (cmd: { operation: operation } & msg): Buffer;

    export function request (uri: string, serialized: Buffer, callback: callback): void;

    export type printerAttributes = {
        'printer-attributes-tag': {
            'printer-info': string,                 // ex. 'Kyocera TASKalfa 3010i'
            'media-size-supported': size[],
            'media-supported': string[],            // ex. ['iso_a4_210x297mm', ...]
            'media-ready': string[],                // ex. ['iso_a5_148x210mm']
            'media-col-ready': mediaCol[],
            'media-source-supported': string[],     // ex. ['auto', 'by-pass-tray', 'tray-1', 'tray-2']
            'document-format-supported': string[],  // ex. ['application/pdf', 'image/jpeg']
        },
    }

    export type jobAttributes = {
        media: string,
        'media-col': Partial<mediaCol>,             // 印表機不一定支援
        [others: string]: primitive | primitive[] | attr | any;
    }
    
    type size = {
        'x-dimension': number | number[],
        'y-dimension': number | number[],
    }
    
    export type mediaCol = {
        'media-size': size,
        [others: string]: primitive | primitive[] | attr;
    }

    type primitive = string | number | boolean;
    type callback = (error: any, response: any) => void;
}
