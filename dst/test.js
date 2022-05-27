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
const fs = require("fs");
const index = require("./index");
// const uri = 'http://192.168.1.99/ipp';
// const uri = 'ipp://192.168.1.99:631/ipp/print';
const uri = 'ipp://192.168.1.98:631/ipp/print'; // 小台
// const uri = 'ipp://BRW8CC84B996AB8.local:631/ipp/print';        // 小台
(() => __awaiter(void 0, void 0, void 0, function* () {
    const doc1 = fs.readFileSync('./test/order.pdf');
    const doc2 = fs.readFileSync('./test/2.pdf');
    const doc3 = fs.readFileSync('./test/3.pdf');
    const res = yield index.print(uri, 'application/pdf', doc1, { jobAttributes: { "media-col": {
                'media-source': 'by-pass-tray',
                'media-size': { 'x-dimension': 14800, 'y-dimension': 21000 },
            } } });
    // const res = await index.print(uri, 'application/pdf', doc2, { jobAttributes: { "media-col": {
    //     'media-source': 'tray-2',
    //     'media-size': { 'x-dimension': 14800, 'y-dimension': 21000 },
    // }}});
    console.log(res);
}))();
// (async () => {
//     const res = await index.info(uri);
//     console.dir(res['printer-attributes-tag']['media-col-ready'], {depth: null});
//     console.dir(res['printer-attributes-tag']['media-ready'], {depth: null});
//     console.log(res['printer-attributes-tag']['printer-info'])
// })();
