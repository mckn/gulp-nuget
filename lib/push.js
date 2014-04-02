var util = require('util'),
	Transform = require('stream').Transform,
	path = require('path'),
	PluginError = require('gulp-util').PluginError,
	pushcmd = require('./push-cmd');

function NugetPushStream(options) {
	if(!(this instanceof NugetPushStream)) {
		return new NugetPushStream(options);
	}

	this.options = options || {};
	this.options.objectMode = true;

	if(!this.options.feed) {
		throw new PluginError('feed argument missing from options');
	}

	if(!this.options.nuget) {
		throw new PluginError('nuget.exe argument missing from options');
	}

	Transform.call(this, this.options);
}

util.inherits(NugetPushStream, Transform);

NugetPushStream.prototype._transform = function(file, encoding, next) {
	var extension = path.extname(file.path),
		self = this;

	if(extension !== '.nupkg') {
		next();
		return;
	}

	pushcmd.run(file.path, this.options, function() {
		next(null, file);
	});
};

module.exports = function(options) {
	return new NugetPushStream(options);
};