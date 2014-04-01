var fs = require('fs-extra'),
	Transform = require('stream').Transform,
	util = require('util'),
	path = require('path'),
	log = require('./log'),
	packcmd = require('./pack-cmd');

function NugetPackStream(options) {
	if(!(this instanceof NugetPackStream)) {
		return new NugetPackStream(options);
	}

	this.options = options || {};
	this.options.objectMode = true;
	this.options.workingDirectory = options.workingDirectory || "./publish";

	Transform.call(this, this.options);
}

util.inherits(NugetPackStream, Transform);

NugetPackStream.prototype._transform = function(file, encoding, next) {
	var fileName = path.basename(file.path),
		copyTo = path.join(this.options.workingDirectory, fileName);

	if(fileName.toLowerCase() === 'package.json') {
		copyTo = path.join(this.options.workingDirectory, '_package.json');	
	}

	fs.outputFile(copyTo, file._contents, function(err) {
		log(err);
		next();
	});
};

NugetPackStream.prototype._flush = function(done) {
	var self = this;
	packcmd.run(self.options, function(nugetPackage) {
		fs.remove(self.options.workingDirectory, function(err) {
			log(err);
			
			if(nugetPackage) {
				self.push(nugetPackage);
			}
			
			done();
		});
	});
};

module.exports = function(options) {
	return new NugetPackStream(options);
};