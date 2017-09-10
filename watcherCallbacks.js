const { sendFile, readFile, deleteFile } = require('./services');
const { getRelativePath } = require('./helpers');
const { dir_base_path, stb_base_path } = require('./config');
const { warn } = require('./logger');

function onChange(filePath) {
    const prevState = directoryHash.get(filePath);

    readFile(filePath)
        .then((file) => {
            if (file !== prevState) {
                directoryHash.set(filePath, file);

                const stbPath = getRelativePath(filePath, dir_base_path, stb_base_path);

                return sendFile(filePath, stbPath);
            }
        })
        .catch(warn);
}

function onUnlink(filePath) {
    deleteFile(filePath)
        .catch(warn);
}

module.exports = {
	onChange,
}