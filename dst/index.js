"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.print = exports.info = void 0;
const ipp = require("ipp");
function info(uri) {
    return new Promise((resolve, reject) => {
        ipp.Printer(uri).execute('Get-Printer-Attributes', { 'operation-attributes-tag': {} }, (err, res) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
}
exports.info = info;
/**
 * @param uri ex. http://192.168.1.99/ipp or ipp://192.168.1.99:631/ipp
 * @param documentFormat ex. 'application/pdf'
 * @param data document of buffer type
 * @param param.docName job name
 * @param param.tray print to a specific tray
 */
function print(uri, documentFormat, data, param) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            ipp.Printer(uri).execute('Print-Job', {
                'operation-attributes-tag': {
                    'document-format': documentFormat,
                    'job-name': (param === null || param === void 0 ? void 0 : param.docName) ? param.docName : 'untitled',
                },
                'job-attributes-tag': (param === null || param === void 0 ? void 0 : param.jobAttributes) || {},
                data,
            }, (err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    });
}
exports.print = print;
