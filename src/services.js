const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const scp = require('./scpcmd');
const { dir_base_path, stb_base_path } = require('./config');
const { user, port, host } = require('./config');
const { info, error } = require('./logger');
const { getDeleteCmd, getCmd, convertPath, flow, getRelativePath } = require('./helpers');

const scpDefaults = {
    user,
    port,
    host,
};

function getScpOptions(options) {
    return Object.assign({}, scpDefaults, options);
}

function sendFile(file, path) {
    return new Promise((resolve, reject) => {
        scp.send(getScpOptions({ file, path }), (err, stdout) => {
            if (err) {
                reject(err);
            } else {
                info(getRelativePath(convertPath(file), dir_base_path), 'WAS TRANSFERED');
                resolve(stdout);
            }
        });
    });
}

function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, file) => (err ? reject(err) : resolve(file)));
    });
}

function remountFs() {
    return new Promise((resolve, reject) => {
        const command = getCmd([
            'ssh',
            `${user}@${host}`,
            '"mount -o remount,rw /"',
        ]);

        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(err, stderr);
            } else {
                info('stb filesystem was remounted');
                resolve(stdout);
            }
        });
    }).catch(e => error('remountFs', e && e.stack));
}

function deleteFile(path) {
    return new Promise((resolve, reject) => {
        const command = getCmd([
            'ssh',
            `${user}@${host}`,
            flow(convertPath, getDeleteCmd)(path),
        ]);

        exec(command, (err, stdout) => {
            if (err) {
                reject(err);
            } else {
                info(getRelativePath(convertPath(path), dir_base_path), 'WAS REMOVED');
                resolve(stdout);
            }
        });
    }).catch(e => error('deleteFile', e && e.stack));
}


function restartStbApp() {
    return new Promise((resolve, reject) => {
        const command = getCmd([
            'ssh',
            `${user}@${host}`,
            '"killall -9 node"',
        ]);

        exec(command, (err, stdout) => {
            if (err) {
                reject(err);
            } else {
                info('restarting jsapp...');
                resolve(stdout);
            }
        });
    }).catch(e => error('restartStbApp', e && e.stack));
}


function makeDirectory(dirPath) {
    return new Promise((resolve, reject) => {
        const command = getCmd([
            'ssh',
            `${user}@${host}`,
            `mkdir ${dirPath}`,
        ]);

        exec(command, (err, stdout) => {
            if (err) {
                reject(err);
            } else {
                info(dirPath, 'DIRECTORY WAS CREATED');
                resolve(stdout);
            }
        });
    }).catch(e => error('makeDirectory', e && e.stack));
}

module.exports = {
    sendFile,
    readFile,
    deleteFile,
    remountFs,
    restartStbApp,
    makeDirectory,
};
