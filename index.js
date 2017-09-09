const chokidar = require('chokidar');
const path = require('path');

const { sendFile, readFile } = require('./services');
const { getRelativePath } = require('./helpers');
const { warn, log, info } = require('./logger');
const { traverse } = require('./traverse');
const { dir_base_path, stb_base_path } = require('./config');

const directoryHash = traverse(dir_base_path);
const watcher = chokidar.watch(dir_base_path);

watcher.on('error', console.log);

watcher.on('change', (filePath) => {
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
});

watcher.on('unlink', console.log.bind(console, 'UNLINK EVENT:   ::::::::'));
watcher.on('add', console.log.bind(console, 'ADD EVENT:   ::::::::'));
watcher.on('unlinkDir', console.log.bind(console, 'UNLINK DIR EVENT:   ::::::::'));
watcher.on('addDir', console.log.bind(console, 'ADD DIR EVENT:   ::::::::'));

