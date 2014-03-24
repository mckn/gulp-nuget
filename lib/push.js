var exec = require('child_process').exec,
	gutil = require('gulp-util'),
	util = require('util'),
	Writable = require('stream').Writable,
	path = require('path');

function log(output) {
	if(output) {
		gutil.log(output);
	}
}

function createPushCommand(filePath, options) {
	var cmd = options.nuget + ' push ' + filePath;
	if(options.apiKey) {
		cmd += ' ' + options.apiKey;
	}
	cmd += ' -s ' + options.feed;

	return cmd;
}

function NugetPushStream(options) {
	if(!(this instanceof NugetPushStream)) {
		return new NugetPushStream(options);
	}

	this.options = options || {};
	this.options.objectMode = true;

	Writable.call(this, this.options);
}

util.inherits(NugetPushStream, Writable);


NugetPushStream.prototype._write = function(file, encoding, next) {
	var extension = path.extname(file.path);

	if(extension !== '.nupkg') {
		next();
		return;
	}

	var cmd = createPushCommand(file.path, this.options);
	exec(cmd, function(err, stdout, stderr) {
		log(err);
		log(stdout);

		next();
	});
};

NugetPushStream.create = function(options) {
	return new NugetPushStream(options);
};

module.exports = NugetPushStream.create;