const fs = require('fs');
const { promisify } = require('util');

const scp = require('./scpcmd');
const { dirBasePath } = require('./config');
const { user, port, host } = require('./config');
const { info } = require('./logger');
const { getDeleteCmd, getCmd, convertPath, flow, getRelativePath, getCmdExucutor } = require('./helpers');

const read = promisify(fs.readFile);

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
                info(getRelativePath(convertPath(file), dirBasePath), 'WAS TRANSFERED');
                resolve(stdout);
            }
        });
    });
}

function readFile(filePath) {
    return read(filePath, 'utf-8');
}

const remountFs = getCmdExucutor(
    getCmd([
        'ssh',
        `${user}@${host}`,
        '"mount -o remount,rw /"',
    ]),
    'stb filesystem was remounted',
    'remountFs',
);

const ipTables = getCmdExucutor(
    getCmd([
        'ssh',
        `${user}@${host}`,
        '"/usr/sbin/iptables -F"',
    ]),
    'iptables -F',
    'ipTables',
);

const deleteFile = getCmdExucutor(
    filePath => getCmd([
        'ssh',
        `${user}@${host}`,
        flow(convertPath, getDeleteCmd)(filePath),
    ]),
    filePath => `${getRelativePath(convertPath(filePath), dirBasePath)} WAS REMOVED`,
    'deleteFile',
);

const restartStbApp = getCmdExucutor(
    getCmd([
        'ssh',
        `${user}@${host}`,
        '"systemctl restart jsapp"',
    ]),
    'restarting jsapp...',
    'restartStbApp',
);


const makeDirectory = getCmdExucutor(
    dirPath => getCmd([
        'ssh',
        `${user}@${host}`,
        `mkdir ${dirPath}`,
    ]),
    dirPath => `${dirPath} DIRECTORY WAS CREATED`,
    'makeDirectory',
);

const stopJsapp = getCmdExucutor(
    getCmd([
        'ssh',
        `${user}@${host}`,
        '"systemctl stop jsapp"',
    ]),
    'JsApp was stopped',
    'stopJsApp'
);


// function mountSecureStorageDir() {
//     return new Promise((resolve, reject) => {
//         const stbBasePathConverted = flow(path.join, convertPath)(stbBasePath, 'src');
//         const stbMountPathConverted = convertPath(stbMountPath);
//         const stbRunshPathConverted = flow(path.join, convertPath)(stbMountPath, 'run.sh');

//         const command = getCmd([
//             'ssh',
//             `${user}@${host}`,
//             `umount ${stbMountPath}; mount --bind ${stbBasePathConverted} ${stbMountPathConverted}; chmod +x ${stbRunshPathConverted}`,
//         ]);

//         exec(command, (err, stdout) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 info(stbMountPath, 'WAS MOUNTED');
//                 resolve(stdout);
//             }
//         });
//     });
// }

module.exports = {
    sendFile,
    stopJsapp,
    ipTables,
    readFile,
    deleteFile,
    remountFs,
    restartStbApp,
    makeDirectory,
};
