const fs = require('fs');
const { exec } = require('child_process');

const scp = require('./scp123');
const { dir_base_path, stb_base_path } = require('./config');
const { user, port, host } = require('./config');
const { warn, info, log } = require('./logger');
const { getDeleteCmd, getCmd, convertPath, flow, getRelativePath } = require('./helpers');

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
		scp.send(getScpOptions({ file, path }), (err, stdout) => {
		    if (err) {
		    	reject(err);
		    } else {
		    	info('FILE',
					 getRelativePath(convertPath(file), dir_base_path),
					 'TRASFERED TO',
					 getRelativePath(convertPath(path), stb_base_path)
				);
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

function remountFs() {
	return new Promise((resolve, reject) => {
		const command = getCmd([
			'ssh',
			`${user}@${host}`,
			'"mount -o remount,rw /"',
		]);

		exec(command, (err, stdout, sdterr) => {
			if (err) {
				reject(err);
			} else {
				resolve(stdout);
			}
		});
	});
}

function deleteFile(path) {
	return new Promise((resolve, reject) => {
		const command = getCmd([
			'ssh',
			`${user}@${host}`,
			flow(convertPath, getDeleteCmd)(path),
		]);

		exec(command, (err, stdout, stderr) => {
			if (err) {
				reject(err);
			} else {
				info(`${flow(getRelativePath, convertPath)(path)} WAS REMOVED`);
				resolve(stdout);
			}
		});
	});
}

module.exports = {
    sendFile,
    readFile,
    deleteFile,
    remountFs,
}
