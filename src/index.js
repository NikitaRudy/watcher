const chokidar = require('chokidar');

const { error, info } = require('./logger');
const { onChange, onUnlink, onAddDir } = require('./watcherCallbacks');
const { dir_base_path } = require('./config');
const { remountFs, restartStbApp } = require('./services');

const watcher = chokidar.watch(dir_base_path);

remountFs()
    .then(() => info('Sending the files...'))
    .then(() => onAddDir(dir_base_path))
    .then(restartStbApp)
    .then(() => {
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
