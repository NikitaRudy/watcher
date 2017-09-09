const { user, port, host } = require('./config');

function getPathProperty(path) {
    return path.replace(/\\/g, '');
}

function getScpOptions({ file, host, port, path }) {
    return {
        user,
        port,
        host,
        file,
        path,
    }
}

module.exports = {
    getPathProperty,
    getScpOptions
}
