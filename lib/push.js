var util = require('util'),
	Duplex = require('stream').Duplex,
	path = require('path'),
	pushcmd = require('./push-cmd');

function NugetPushStream(options) {
	if(!(this instanceof NugetPushStream)) {
		return new NugetPushStream(options);
	}

	this.options = options || {};
	this.options.objectMode = true;

	Duplex.call(this, this.options);
}

util.inherits(NugetPushStream, Duplex);

NugetPushStream.prototype._write = function(file, encoding, next) {
	var extension = path.extname(file.path);
	if(extension !== '.nupkg') {
		next();
		return;
	}
	pushcmd.run(file.path, options, next);
};

module.exports = function(options) {
	return new NugetPushStream(options);
};