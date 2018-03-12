const fs = require('fs');
const path = require('path');

const { sendFile, readFile, deleteFile, makeDirectory } = require('./services');
const { getAppropriatePath, convertPath } = require('./helpers');
const { dirBasePath, stbBasePath } = require('./config');
const { warn } = require('./logger');
const { traverse } = require('./traverse');

const directoryHash = new Map();

function onChange(filePath) {
    const prevState = directoryHash.get(filePath);

    const stats = fs.statSync(filePath);
    const isDirectory = stats.isDirectory();

    if (isDirectory) {
        const dirStbPath = getAppropriatePath(convertPath(filePath), dirBasePath, stbBasePath);
        makeDirectory(dirStbPath);
    } else {
        readFile(filePath)
            .then((file) => {
                if (file !== prevState) {
                    directoryHash.set(filePath, file);

                    const stbPath = getAppropriatePath(convertPath(filePath), dirBasePath, stbBasePath);

                    sendFile(filePath, stbPath).catch(warn.bind(null, 'SEND FILE'));
                }
            })
            .catch(warn.bind(null, 'readFile'));
    }
}

function onUnlink(filePath) {
    deleteFile(filePath)
        .catch((e) => {
            warn('deleteFile', e && e.stack);
        });
}

function onAddDir(dirPath) {
    traverse(dirPath, directoryHash);
    return sendFile(path.join(dirPath, '/*'), stbBasePath);
}

module.exports = {
    onChange,
    onUnlink,
    onAddDir,
};
