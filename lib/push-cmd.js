var execFile = require('child_process').execFile,
	PluginError = require('gulp-util').PluginError,
	log = require('./log');

function createArgs(nugetPkgFilePath, options) {
	var args = ['push', nugetPkgFilePath];
	if(options.apiKey) {
		args.push(options.apiKey);
	}
	args.push("-s");
	args.push(options.feed);

	return args;
}

function run(nugetPkgFilePath, options, callback) {
	var args = createArgs(nugetPkgFilePath, options);
	execFile(options.nuget, args, function(err, stdout, stderr) {
		if(err) {
			callback(new PluginError('gulp-nuget', stderr));
		}

		log(stdout);
		callback();
	});
}

module.exports = {
	run: run
};