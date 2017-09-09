const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const scp = require('scp');

const { getScpOptions } = require('./helpers');
const { warn, log, info } = require('./logger');
const { traverse } = require('./traverse');

const HOME = process.env['HOME'];
const BASE_PATH = path.resolve(__dirname, path.join(HOME, '/Projects/one_mw/onemw-js/src/'));

const projectHash = traverse(BASE_PATH);

const watcher = chokidar.watch(BASE_PATH);

watcher.on('error', console.log);
watcher.on('change', (filePath) => {
    info('changes at: ', filePath);
    const prevState = projectHash.get(filePath);
    fs.readFile(filePath, 'utf-8', (err, file) => {
        if (file !== prevState) {
            log('file changed');
            const options = getScpOptions({ file: filePath });
            scp.send(options, (err) => {
                if (err) warn('ERR', err);
                else info('FILE TRASFERED!!')
            })
        }
    });
});
