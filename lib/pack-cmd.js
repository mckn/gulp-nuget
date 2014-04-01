var execFile = require('child_process').execFile,
	gutil = require('gulp-util'),
	log = require('./log'),
	File = require('vinyl'),
	fs = require('fs-extra'),
	path = require('path');

function createArgs(options) {
	var args = ['pack', options.nuspec];
	if(options.version) {
		args.push('-version');
		args.push(options.version);
	}
	args.push('-nopackageanalysis');
	args.push('-noninteractive');
	
	return args;
}

function getPackageFilePath(stdout) {
	var regexp = /'(.+\.nupkg)'/;

	if(!stdout) {
		return;
	}

	var matches = stdout.match(regexp);
	if(!matches.length || matches.length < 1) {
		return;
	}

	return matches[1];
}

function readPackage(filePath, callback) {
	fs.exists(filePath, function(exists) {
		if(!exists) {
			callback();
			return;
		}

		fs.readFile(filePath, function(err, data) {
			var nugetPackage = new File({
				base: path.dirname(filePath),
				path: filePath,
				contents: data
			});

			callback(nugetPackage);
		});
	});
}

function run(options, callback) {
	var args = createArgs(options);
	execFile(options.nuget, args, function(err, stdout, stderr) {
		if(err) {
			throw new gutil.PluginError(err);
		}

		log(stdout);

		var filePath = getPackageFilePath(stdout);
		readPackage(filePath, callback);
	});
}

module.exports = {
	run: run
};