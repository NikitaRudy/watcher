module.exports =  {
    info(...args) {
        console.info('INFO::::::: ', args.join(' --> '));
    },
    warn(...args) {
        console.warn('WARN::::::: ', args.join(' --> '));
    },
    log(...args) {
        console.log('LOG:::::::: ', ...args);
    },
};
