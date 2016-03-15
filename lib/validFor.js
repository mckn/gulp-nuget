'use strict';

var gutil = require('gulp-util');

exports.pack = function(file) {
  var msg = file.path + ' is not supported. Supported files for nuget pack are: .nuspec, .csproj.';
  var regexp = /^(\.nuspec|\.csproj)$/i;

  return supported(file, regexp, msg);
};

exports.restore = function(file) {
  var basename = file.basename || '';
  if(basename.match(/^(package\.config|project\.json)$/i)) {
    return true;
  }

  var msg = file.path + ' is not supported. Supported files for nuget restore are: package.config, *.sln., project.json';
  var regexp = /^(\.sln)$/i;

  return supported(file, regexp, msg);
};

exports.push = function(file) {
  var msg = file.path + ' is not supported. Supported files for nuget push are: .nupkg';
  var regexp = /^(\.nupkg)$/i;

  return supported(file, regexp, msg);
};

function supported(file, regexp, msg) {
	if(!file || !file.path) {
		return false;
	}

	var extension = file.extname || path.extname(file.path);

	if(!extension || !extension.match(regexp)) {
		gutil.log(file.path + msg);
		return false;
	}

	return true;
}