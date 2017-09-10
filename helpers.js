function getRelativePath(path, base1, base2) {
    return base2.concat(path.slice(base1.length));
}

function getDeleteCmd(path) {
	return `"rm -rf ${path}"`;
}

module.exports = {
    getRelativePath,
    getDeleteCmd,
}