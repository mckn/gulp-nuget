var exec = require('child_process').exec,
	PluginError = require('gulp-util').PluginError,
	log = require('./log');

function create(nugetPkgFilePath, options) {
	var cmd = options.nuget + ' push ' + nugetPkgFilePath;
	if(options.apiKey) {
		cmd += ' ' + options.apiKey;
	}
	cmd += ' -s ' + options.feed;

	return cmd;
}

function run(nugetPkgFilePath, options, callback) {
	var cmd = create(nugetPkgFilePath, options);

	exec(cmd, function(err, stdout, stderr) {
		if(err) {
			callback(new PluginError(stderr));
		}

		log(stdout);
		callback();
	});
}

module.exports = {
	run: run,
	create: create
};