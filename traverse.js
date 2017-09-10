const path = require('path');
const fs = require('fs');
const { info, warn, log } = require('./logger');

function traverse(root) {
    const hash = new Map();

    const queue = [];

    queue.push(root);

    while (queue.length > 0) {
        const currentDir = queue.shift();

        const files = fs.readdirSync(currentDir);

        files.forEach((cur) => {
            const hashPath = path.join(currentDir, cur);
            const stats = fs.statSync(hashPath);
            const isDir = stats.isDirectory();
    
            if (isDir) {
                queue.push(hashPath);
            } else {
                const file = fs.readFileSync(hashPath, 'utf-8');
                hash.set(hashPath, file);
            }
        })
    }

    return hash;
}

module.exports = { traverse };
