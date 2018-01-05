const chokidar = require('chokidar');
const path = require('path');

const { error } = require('./logger');
const { onChange, onUnlink, onAddDir } = require('./watcher.callbacks');
const { dirBasePath, stbBasePath } = require('./config');
const { remountFs, mountSecureStorageDir, deleteFile, ipTables, stopJsapp } = require('./services');

const watcher = chokidar.watch(dirBasePath);

remountFs()
    .then(() => ipTables())
    .then(() => deleteFile(path.join(stbBasePath, 'src')))
    .then(() => onAddDir(dirBasePath))
    // .then(() => mountSecureStorageDir())
    .then(() => {
        stopJsapp();
        watcher
            .on('error', error.bind(null, 'wathcher error'))
            .on('change', onChange)
            .on('add', onChange)
            .on('addDir', onChange)
            .on('unlink', onUnlink)
            .on('unlinkDir', onUnlink);
    })
    .catch((e) => {
        error('Boot error', e && e.stack);
    });
