declare module 'ipp' {
    type operation = 'Get-Printer-Attributes' | 'Print-Job';

    type attr = { [field: string]: primitive | primitive[] | attr };
    type msg = {
        'operation-attributes-tag': attr,
        'job-attributes-tag'?: Partial<jobAttributes>,
        data?: Buffer,
    }

    function Printer (uri: string): {
        execute: (operation: operation, msg: msg, callback: callback) => void,
    }

    function serialize (cmd: { operation: operation } & msg): Buffer;

    function request (uri: string, serialized: Buffer, callback: callback): void;

    type jobAttributes = {
        media: string,
        'media-col': Partial<mediaCol>,             // 印表機不一定支援
        [others: string]: primitive | primitive[] | attr | any;
    }
    
    type size = {
        'x-dimension': number | number[],
        'y-dimension': number | number[],
    }
    
    type mediaCol = {
        'media-size': size,
        [others: string]: primitive | primitive[] | attr;
    }

    type primitive = string | number | boolean;
    type callback = (error: any, response: any) => void;
}
