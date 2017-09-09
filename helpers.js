function getPathProperty(path) {
    return path.replace(/\\/g, '');
}

function getRelativePath(path, base1, base2) {
    return base2.concat(path.slice(base1.length));
}

module.exports = {
    getPathProperty,
    getRelativePath,
}