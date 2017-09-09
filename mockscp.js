const shelljs = require('shelljs');

module.exports = {
	send(options, cb) {
		setImmediate(() => {
			shelljs.cp(options.file, options.path)
			cb();
		});
	}
}