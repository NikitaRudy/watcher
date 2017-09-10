const chokidar = require('chokidar');

const { warn, log, info } = require('./logger');
const { traverse } = require('./traverse');
const { onChange, onUnlink } = require('./watcherCallbacks');


const directoryHash = traverse(dir_base_path);
const watcher = chokidar.watch(dir_base_path);

watcher
    .on('error', warn)
    .on('change', onChange)
    .on('add', onChange)
    .on('addDir', onChange);
    .on('unlink', onUnlink)
    .on('unlinkDir', onUnlink);

