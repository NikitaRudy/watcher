const fs = require('fs');

const { sendFile, readFile, deleteFile, makeDirectory } = require('./services');
const { getAppropriatePath, convertPath, flow } = require('./helpers');
const { dir_base_path, stb_base_path } = require('./config');
const { warn } = require('./logger');
const { traverse } = require('./traverse');

const directoryHash = new Map();

function onChange(filePath) {
    const prevState = directoryHash.get(filePath);

    const stats = fs.statSync(filePath);
    const isDirectory = stats.isDirectory();

    if (isDirectory) {
        const dirStbPath = flow(getAppropriatePath, convertPath)(filePath, dir_base_path, stb_base_path);
        console.log(dirStbPath);
        makeDirectory(dirStbPath);
    } else {
        readFile()
            .then((file) => {
                if (file !== prevState) {
                    directoryHash.set(filePath, file);

                    const stbPath = flow(getAppropriatePath, convertPath)(filePath, dir_base_path, stb_base_path);
                    console.log(stbPath);

                    sendFile(filePath, stbPath).catch(warn.bind(null, 'SEND FILE'));
                }
            })
            .catch(warn.bind(null, 'readFile'));
    }
}

function onUnlink(filePath) {
    const stbPath = getAppropriatePath(filePath, dir_base_path, stb_base_path);

    deleteFile(stbPath)
        .catch((e) => {
            warn('deleteFile', e && e.stack);
        });
}

function onAddDir(dirPath) {
    traverse(dirPath, directoryHash);

    const stbPath = getAppropriatePath(dirPath, dir_base_path, stb_base_path);

    return sendFile(dirPath, stbPath);
}

module.exports = {
    onChange,
    onUnlink,
    onAddDir,
};
