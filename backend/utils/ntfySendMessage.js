import * as _config from "../config.json" with { type: 'json' };
const config = _config.default;

async function ntfySendMessage(content, headers) {
    await fetch(config.notifyServer.url, {
        method: config.notifyServer.method,
        body: content.toString(),
        headers
    });
}

export default ntfySendMessage;