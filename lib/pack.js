var fs = require('fs-extra'),
	Transform = require('stream').Transform,
	util = require('util'),
	gutil = require('gulp-util'),
	path = require('path'),
	exec = require('child_process').exec,
	File = require('vinyl');

function log(output) {
	if(output) {
		gutil.log(output);
	}
}

function createPackCommand(options) {
	var cmd = options.nuget + ' pack ' + options.nuspec;

	if(options.version) {
		cmd += ' -version ' + options.version;
	}
	cmd += ' -nopackageanalysis -noninteractive';
	
	return cmd;
}

function readNugetPackage(filePath, cb) {
	fs.exists(filePath, function(exists) {
		if(!exists) {
			cb();
			return;
		}

		fs.readFile(filePath, function(err, data) {
			var pkg = new File({
				base: path.dirname(nupgkFilePath),
				path: nupgkFilePath,
				contents: data
			});

			cb(err, pkg);
		});
	});
}

function getNugetPackageFilePath(stdout) {
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

function createNugetPackage(options, done) {
	var cmd = createPackCommand(options),
		workdir = options.workdir;

	exec(cmd, function(err, stdout, stderr) {
		log(err);
		log(stdout);

		fs.remove(workdir, function(err) {
			log(err);

			nupgkFilePath = getNugetPackageFilePath(stdout);
			readNugetPackage(nupgkFilePath, done);
		});
	});
}

function NugetPackStream(options) {
	if(!(this instanceof NugetPackStream)) {
		return new NugetPackStream(options);
	}

	this.options = options || {};
	this.options.objectMode = true;
	this.options.workdir = options.workdir || "./publish";

	Transform.call(this, this.options);
}

util.inherits(NugetPackStream, Transform);

NugetPackStream.prototype._transform = function(file, encoding, next) {
	var fileName = path.basename(file.path),
		copyTo = path.join(this.options.workdir, fileName);

	fs.outputFile(copyTo, file._contents, function(err) {
		log(err);
		next();
	});
};

NugetPackStream.prototype._flush = function(done) {
	var self = this;

	createNugetPackage(self.options, function(err, pkgFile) {
		log(err);

		fs.remove(self.options.workdir, function(err) {
			log(err);

			if(pkgFile) {
				self.push(pkgFile);
			}
			done();
		});
	});
};

NugetPackStream.create = function(options) {
	return new NugetPackStream(options);
};

module.exports = NugetPackStream.create;