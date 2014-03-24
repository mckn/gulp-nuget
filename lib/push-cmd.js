var exec = require('child_process').exec,
	gutil = require('gulp-util'),
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
			callback(new gutil.PluginError(stderr));
		}

		log(stdout);
		callback();
	});
}

modules.export = {
	run: run,
	create: create
};