'use strict';

var cproc = require('child_process');
var through = require('through2');
var fs = require('fs-extra');
var gutil = require('gulp-util');
var argsFor = require('./argsFor');
var validFor = require('./validFor');
var path = require('path');
var File = require('vinyl');

module.exports = function(options) {
	options = options || {};
	options.nuget = options.nuget || './nuget.exe';
	options.outputDirectory = options.outputDirectory || './.gulp-nuget';
	options.maxBuffer = options.maxBuffer || 200*1024;

	return through.obj(function(file, encoding, done) {
		if(!validFor.pack(file)) {
			return done(null, file);
		}

		var self = this;
		var args = argsFor.pack(file.path, options);
		var opts = { maxBuffer: options.maxBuffer };

		fs.mkdirs(options.outputDirectory, function(err) {
			if(err) throw new gutil.PluginError('gulp-nuget', err);

			cproc.execFile(options.nuget, args, opts, function(err, stdout) {
				if(err) throw new gutil.PluginError('gulp-nuget', err);

				gutil.log(stdout.trim());

				var files = findNupkgs(stdout);
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

function findNupkgs(stdout) {
  var matches = [];
  var nupkg = new RegExp('[\'"„“](.+\.nupkg)[\'"”]', 'ig');

  var match = nupkg.exec(stdout);

  while(match != null) {
    matches.push(match[1]);
    match = nupkg.exec(stdout);
  }

  if(!matches || !matches.length) {
    throw new gutil.PluginError('gulp-nuget', 'Could not detect any output .nupkg files from nuget.');
  }

  return matches;
};
