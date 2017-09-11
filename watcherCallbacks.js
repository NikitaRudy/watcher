const { sendFile, readFile, deleteFile } = require('./services');
const { getAppropriatePath } = require('./helpers');
const { dir_base_path, stb_base_path } = require('./config');
const { warn, info } = require('./logger');
const { traverse } = require('./traverse');

const directoryHash = traverse(dir_base_path);

function onChange(filePath) {
    const prevState = directoryHash.get(filePath);

    readFile(filePath)
        .then((file) => {
            if (file !== prevState) {
                directoryHash.set(filePath, file);

                const stbPath = getAppropriatePath(filePath, dir_base_path, stb_base_path);

                return sendFile(filePath, stbPath).catch(warn.bind(null, 'SEND FILE'));
            }
        })
        .catch(warn.bind(null, 'readFile'));
}

function onUnlink(filePath) {
    const stbPath = getAppropriatePath(filePath, dir_base_path, stb_base_path);

    deleteFile(stbPath)
        .catch(warn.bind(null, 'deleteFile'));
}

module.exports = {
	onChange,
    onUnlink,
}
