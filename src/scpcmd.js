const { spawn } = require('child_process');
const { convertPath } = require('./helpers');

function send(options, cb) {
    const { file, path, port, host, user } = options;

    const scp = spawn(
        'scp',
        ['-r', '-P', port, convertPath(file), `${user}@${host}:${convertPath(path)}`], { stdio: 'inherit' }
    );

    scp.on('close', (code) => {
        switch (true) {
            case !!cb:
                cb(code);
                break;
            case code !== '0':
                throw new Error();
            default:
        }
    });
}

module.exports = {
    send,
};
