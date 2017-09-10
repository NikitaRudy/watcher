const fs = require('fs');
const { exec } = require('child_process');

const scp = require('./scp');
const { user, port, host } = require('./config');
const { warn, info, log } = require('./logger');
const { getDeleteCmd } = require('./helpers');

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

function deleteFile(path)  {
	return new Promise((resolve, reject) => {
		const command = [
			'ssh',
			`${user}@${host}`,
			getDeleteCmd(path),
		];

		exec(command.join(' '), (err, stdout, stderr) => {
			if (err) {
				reject(err);
			} else {
				info(`THE FILE OR DIRECTORY AT PATH: ${path} WAS REMOVED`);
				resolve(stdout);
			}
		});
	});
}

module.exports = {
    sendFile,
    readFile,
    deleteFile,
}
