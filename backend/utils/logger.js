class Logger {
    constructor(invoker) {
        this.invoker = invoker;
    }

    red(text) { return `\u001b[31m${text}\u001b[0m`; }
    green(text) { return `\u001b[32m${text}\u001b[0m`; }
    yellow(text) { return `\u001b[33m${text}\u001b[0m`; }
    cyan(text) { return `\u001b[36m${text}\u001b[0m`; }
    gray(text) { return `\u001b[90m${text}\u001b[0m`; }

    log(...text) {
        console.log(`${this.gray(`[${this.invoker}]:`)}`, ...text);
    }

    error(...text) {
        console.error(`${this.red(`[${this.invoker}]:`)}`, ...text);
    }

    info(...text) {
        console.info(`${this.cyan(`[${this.invoker}]:`)}`, ...text);
    }

    warn(...text) {
        console.warn(`${this.yellow(`[${this.invoker}]:`)}`, ...text);
    }
}

export default Logger;