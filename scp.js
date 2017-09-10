const { exec } = require('child_process');
const { getCmd } = requre('./helpers');


function send(options, cb) {
	const { file, path, port, host, user } = options;

	const command = getCmd([
		'scp',
		'-r',
		'-P',
		port,
		'-o "ControlMaster no"',
		file,
		`${user}@${host}:${path}`,
	]);

	exec(command, (err, stdout, stderr) => {
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