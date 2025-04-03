import { polkaApp } from "../server.js";
import { readFile } from 'node:fs/promises';
import Showdown from "showdown";
import sendHTML from "../utils/response/sendHTML.js";

const converter = new Showdown.Converter();

polkaApp.get('/', async (req, res) => {
    const path = './api.md';    

    try {
        const data = await readFile(path);
        const mdContent = data.toString('utf-8');        
        const html = converter.makeHtml(mdContent);

        return sendHTML(res, html, './utils/response/html-template_apihelp.html');
    } catch (err) {
        return res.end(`error reading ${path}: ${err}`);
    }
});
