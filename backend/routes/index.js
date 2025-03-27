import { polkaApp } from "../server.js";
import { readFile } from 'node:fs';
import Showdown from "showdown";
import sendHTML from "../utils/response/sendHTML.js";

const converter = new Showdown.Converter();

polkaApp.get('/', async (req, res) => {
    const path = './api.md';

    readFile(path, async (err, data) => {
        if (err) return res.end(`error reading ${path}: ${err}`);
        
        const mdContent = data.toString('utf-8');

        const html = converter.makeHtml(mdContent);
        return sendHTML(res, html, './utils/response/html-template_apihelp.html');
    });
});

