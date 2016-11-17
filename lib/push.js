'use strict';

var fs = require('fs-extra');
var through = require('through2');
var cproc = require('child_process');
var gutil = require('gulp-util');
var argsFor = require('./argsFor');
var validFor = require('./validFor');

module.exports = function(options) {
	options = options || {};
	options.nuget = options.nuget || './nuget.exe';

	return through.obj(function(file, encoding, done) {
		if(!validFor.push(file)) {
			return done(null, file);
		}

		fs.exists(file.path, function(exists) {
			if(exists) {
				return pushToSource(options, file, done);
			}

			fs.outputFile(file.path, file.contents, function(err) {
				pushToSource(options, file, function() {
					fs.remove('./.gulp-nuget', done);
				});
			});
		});

	});
};

function pushToSource(options, file, done) {
	var args = argsFor.push(file.path, options);

	cproc.execFile(options.nuget, args, function(err, stdout) {
		if(err) throw new gutil.PluginError('gulp-nuget', err);

		gutil.log(stdout.trim());
		done(null, file);
	});
}
