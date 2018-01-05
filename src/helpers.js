const { exec: execCb } = require('child_process');
const { info, error } = require('./logger');
const { promisify } = require('util');

const exec = promisify(execCb);

function getAppropriatePath(path, base1, base2) {
    return base2.concat(path.slice(base1.length));
}

function convertPath(path) {
    return path.replace(/\\/g, '/');
}

function getRelativePath(path, base) {
    return path.slice(base.length) || '/*';
}

function getDeleteCmd(path) {
    return `"rm -rf ${path}"`;
}

function getCmd(cmdParts) {
    return cmdParts.join(' ');
}

function flow(...funcs) {
    return function (...args) {
        return funcs.reduce((res, cur, i) => (i === 0 ? cur.call(null, ...res) : cur(res)), args);
    };
}

function getCmdExucutor(cmd, logMessage, funcName) {
    return function (...args) {
        const command = typeof cmd === 'function' ? cmd(...args) : cmd;

        return exec(command)
            .then((data) => {
                if (Array.isArray(logMessage)) {
                    info(...logMessage);
                } else if (typeof logMessage === 'function') {
                    info(logMessage(...args));
                } else {
                    info(logMessage);
                }
                return data;
            })
            .catch(e => error(funcName, e && e.stack));
    };
}

module.exports = {
    flow,
    getCmd,
    convertPath,
    getDeleteCmd,
    getRelativePath,
    getAppropriatePath,
    getCmdExucutor,
};
