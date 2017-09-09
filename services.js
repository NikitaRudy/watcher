const scp = require('./mockscp');
const fs = require('fs');

const { user, port, host } = require('./config');
const { warn, info, log } = require('./logger');

const scpDefaults = {
	user,
	port,
	host,
}

function getScpOptions(options) {
    return Object.assign({}, scpDefaults, options);
}

function sendFile(file, path) {
	return new Promise((resolve, reject) => {
		scp.send(getScpOptions({ file, path }), (err) => {
		    if (err) {
		    	reject(err);
		    } else {
		    	info('FILE', file, 'TRASFERED TO', path);
		    	resolve();
		    }
		});
	});
}

function readFile(filePath) {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, 'utf-8', (err, file) => {
	        if (err) {
	        	reject(err);
	        } else {
		        resolve(file);
	        }
	    });
	})
}

module.exports = {
    sendFile,
    readFile,
}
