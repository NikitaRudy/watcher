const { exec, spawn } = require('child_process');
const { getCmd, convertPath } = require('./helpers');
const { info, log, warn } = require('./logger');


function send(options, cb) {
	const { file, path, port, host, user } = options;

	const command = getCmd([
		'scp',
		'-r',
		'-P',
		port,
		convertPath(file),
		`${user}@${host}:${convertPath(path)}`,
	]);

	// exec(command, (err, stdout, stderr) => {
	// 	if (cb) {
	// 		cb(err, stdout, stderr);
	// 	} else {
	// 		if (err) {
	// 			throw new Error(err);
	// 		}
	// 	}
	// });

	const scp = spawn('scp', ['-r', '-P', port, convertPath(file), `${user}@${host}:${convertPath(path)}`], { stdio: 'inherit' });
	scp.on('close', (code) => {
		if (cb) {
			cb(code);
		} else {
			if (code !== '0') {
				throw new Error(err);
			}
		}
	});
}

module.exports = {
	send,
};
