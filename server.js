import send from '@polka/send-type';
import cors from "cors";
import { readdir } from 'node:fs';
import polka from 'polka';
import trid from 'trid';

import setupJobs from "./jobs/setupJobs.js";

import Logger from './utils/logger.js';
import ntfySendMessage from "./utils/ntfySendMessage.js";

import * as _config from "./config.json" with { type: 'json' };
const config = _config.default;

const logger = new Logger('server/main');

const serverId = new trid({ prefix: config.server.name, length: config.server.serverIdLength }).base();

const polkaApp = polka({
    async onError(error, req, res) {

        const message = `server error ${error}`;
        logger.error(message);

        return send(res, 500, {
            ok: false,
            code: error.code ?? 500,
            message
        });
    },
    async onNoMatch(req, res) {
        send(res, 404, {
            ok: false,
            code: 404,
            message: `route ${req.path} isn't found`
        });
    }
})
    .use(cors({ origin: true }))
    .listen(config.port, config.hostname, async () => {
        logger.info(`> web server started on http://${config.hostname}:${config.port} for ${serverId}`);

        await setupJobs();
        logger.log('all jobs are setup!');
    });

const routesPath = './routes';
readdir(routesPath, async (err, files) => {
    if (err) throw err;

    files.forEach(async (r) => {
        if (r.endsWith('.js')) {
            await import(`${routesPath}/${r}`);
            logger.log(`registered route "${r.replace('.js', '')}"`);
        }
    });
});

process.once('beforeExit', async (exitCode) => {
    await ntfySendMessage(`panel server "${serverId}" exited, exit code ${exitCode}`, {
        'Title': `panel server "${serverId}" exited (${exitCode})`,
        'Priority': '4',
        'Tags': 'rotating_light,computer'
    });
});

process.once('uncaughtException', async (error) => {
    await ntfySendMessage(`server "${serverId}" crashed (uncaughtException).\nerror details: ${error.stack}`, {
        'Title': `panel server "${serverId}" crashed!`,
        'Priority': '4',
        'Tags': 'computer,skull'
    });
});

process.once('unhandledRejection', async (error) => {
    await ntfySendMessage(`server "${serverId}" crashed (unhandledRejection).\nerror details: ${error.stack}`, {
        'Title': `panel server "${serverId}" crashed!`,
        'Priority': '4',
        'Tags': 'computer,skull'
    });
});

export { polkaApp, serverId };
