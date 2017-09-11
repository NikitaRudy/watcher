const chokidar = require('chokidar');
const path = require('path');

const { warn, log, info } = require('./logger');
const { traverse } = require('./traverse');
const { onChange, onUnlink } = require('./watcherCallbacks');
const { dir_base_path, stb_base_path } = require('./config');
const { remountFs, sendFile, deleteFile } = require('./services');

const watcher = chokidar.watch(dir_base_path);

remountFs()
    .then(() => info('Sending the files...'))
    .then(() => sendFile(dir_base_path + '/*', path.join(stb_base_path)))
    .then(() => {
        watcher
            .on('error', warn.bind(null, 'wathcher error'))
            .on('change', onChange)
            .on('add', onChange)
            .on('addDir', onChange)
            .on('unlink', onUnlink)
            .on('unlinkDir', onUnlink);
    })
    .catch(warn.bind(null, 'Boot error'));
