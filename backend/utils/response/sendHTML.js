import { readFile } from "fs";
import formatTemplate from "../formatTemplate.js";

async function sendHTML(res, html, templatePath = './utils/response/html-template.html') {
    try {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

        readFile(templatePath, async (err, data) => {
            if (err) return res.end(`error reading ${templatePath}: ${err}`);

            data = data.toString('utf-8');

            const template = await formatTemplate(data ?? '', {
                content: html
            });

            return res.end(template);
        });

    } catch {

    }
}

export default sendHTML;