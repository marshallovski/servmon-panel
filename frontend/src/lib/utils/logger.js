class Logger {
    constructor(invoker) {
        this.invoker = invoker;
    }

    log(text) {
        console.log(`%c[${this.invoker}]:`, 'color: #999;', text);
    }

    error(text) {
        console.error(`%c[${this.invoker}]:`, 'color: red;', text);
    }

    info(text) {
        console.info(`%c[${this.invoker}]:`, 'color: #5B96D5;', text);
    }

    warn(text) {
        console.warn(`%c[${this.invoker}]:`, 'color: yellow;', text);
    }
}

export default Logger;