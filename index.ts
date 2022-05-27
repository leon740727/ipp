import * as ipp from 'ipp';

export function info (uri: string): Promise<printerAttributes> {
    return new Promise((resolve, reject) => {
        ipp.Printer(uri).execute(
            'Get-Printer-Attributes',
            {'operation-attributes-tag': {}},
            (err, res: printerAttributes) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
    });
}

/**
 * @param uri ex. http://192.168.1.99/ipp or ipp://192.168.1.99:631/ipp
 * @param documentFormat ex. 'application/pdf'
 * @param data document of buffer type
 * @param param.docName job name
 * @param param.tray print to a specific tray
 */
export async function print (
    uri: string,
    documentFormat: string,
    data: Buffer,
    param?: {
        docName?: string,
        jobAttributes?: Partial<jobAttributes>,
    },
): Promise<printResult> {
    return new Promise((resolve, reject) => {
        ipp.Printer(uri).execute(
            'Print-Job',
            {
                'operation-attributes-tag': {
                    'document-format': documentFormat,
                    'job-name': param?.docName ? param.docName : 'untitled',
                },
                'job-attributes-tag': param?.jobAttributes || {},
                data,
            },
            (err, res: printResult) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
    });
}

type jobAttributes = {
    media: string,
    'media-col': Partial<mediaCol>,             // 印表機不一定支援
    [others: string]: primitive | primitive[] | attr | any;
}

type printerAttributes = {
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

type printResult = {
    version: string,                // ex. '2.0'
    statusCode: string,             // ex. 'successful-ok'
    id: number,
    'job-attributes-tag': {
        'job-id': number,
        'job-uri': string,            // ex. 'ipps://KM4BBD0C:443/jobs/1000'
        'job-state': string,          // ex. 'pending'
        'job-state-reasons': string,  // ex. 'job-incoming'
    },
}

type mediaCol = {
    'media-size': size,
    [others: string]: primitive | primitive[] | attr;
}

type size = {
    'x-dimension': number | number[],
    'y-dimension': number | number[],
}

type attr = { [field: string]: primitive | primitive[] | attr };

type primitive = string | number | boolean;
