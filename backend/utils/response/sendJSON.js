async function sendJSON(res, object) {
    if (typeof object !== 'object') return object;

    try {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        let json = JSON.stringify(object);
        return res.end(json);
    } catch {

    }
}

export default sendJSON;