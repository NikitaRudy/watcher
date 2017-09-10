const { exec } = require('child_process');

function send(options, cb) {
	const { file, path, port, host, user } = options;

	const command = [
		'scp',
		'-r',
		'-P',
		port,
		'-o "ControlMaster no"',
		file,
		`${user}@${host}:${path}`,
	];

	exec(command.join(' '), (err, stdout, stderr) => {
		if (cb) {
			cb(err, stdout, stderr);
		} else {
			if (err) {
				throw new Error(err);
			}
		}
	});
}

module.exports = {
	send,
};