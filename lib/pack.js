'use strict';

var cproc = require('child_process');
var through = require('through2');
var fs = require('fs-extra');
var gutil = require('gulp-util');
var argsFor = require('./argsFor');
var output = require('./output');
var path = require('path');
var File = require('vinyl');

module.exports = function(options) {
	options = options || {};
	options.nuget = options.nuget || './nuget.exe';
	options.outputDirectory = options.outputDirectory || './.gulp-nuget';

	return through.obj(function(file, encoding, done) {
		if(!supported(file)) {
			return done();
		}

		var self = this;
		var args = argsFor.pack(file.path, options);

		fs.mkdirs(options.outputDirectory, function(err) {
			if(err) throw new gutil.PluginError('gulp-nuget', err);

			cproc.execFile(options.nuget, args, function(err, stdout) {
				if(err) throw new gutil.PluginError('gulp-nuget', err);

				gutil.log(stdout);

				var files = output.findNupkgs(stdout);
				pushFiles.call(self, files, done);
			});

		});
	});
};

function pushFiles(files, done) {
	var self = this;

	files.forEach(function(file, index) {
			fs.readFile(file, function(err, data) {
				if(err) throw new gutil.PluginError('gulp-nuget', err);

				self.push(new File({
					base: path.dirname(file),
					path: file,
					contents: data
				}));

				if((index + 1) === files.length) {
					fs.remove('./.gulp-nuget', done);
				}
			});
	});
}

function supported(file) {
	var supported = /^(\.nuspec|\.csproj)$/i;

	if(!file || !file.path) {
		return false;
	}

	if(!file.extname || !file.extname.match(supported)) {
		gutil.log(file.path + ' is not supported. Supported files for nuget pack are: .nuspec, .csproj.');
		return false;
	}

	return true;
}
