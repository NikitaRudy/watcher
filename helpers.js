function getAppropriatePath(path, base1, base2) {
    return base2.concat(path.slice(base1.length));
}

function convertPath(path) {
    return path.replace(/\\/g, '/');
}

function getRelativePath(path, base) {
    return path.slice(base.length);
}

function getDeleteCmd(path) {
	return `"rm -rf ${path}"`;
}

function getCmd(cmdParts) {
	return cmdParts.join(' ');
}

function flow(...funcs) {
    return function (...args) {
        return funcs.reduce((res, cur) => cur(res), args);
    }
}

module.exports = {
    flow,
    getCmd,
    convertPath,
    getDeleteCmd,
    getRelativePath,
    getAppropriatePath,
}
