'use strict';

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

		var args = argsFor.push(file.path, options);
		var self = this;

		cproc.execFile(options.nuget, args, function(err, stdout) {
			if(err) throw new gutil.PluginError('gulp-nuget', err);

			gutil.log(stdout.trim());
			done(null, file);
		});

	});
};
