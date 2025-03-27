import Logger from '$lib/utils/logger.js';
import panelAPI from './index.js';

const logger = new Logger('api/Health');

async function health() {
    try {
        const req = await fetch(`${panelAPI.baseURL}/health`);

        if (!req.status === 200) return logger.error(`failed to fetch: ${req?.status} (${req?.statusText})`);

        const res = await req.json();

        if (!res.ok) logger.warn(`server error: ${res?.message}`);

        return res;
    } catch {
        return false;
    }
}

export default health;