'use strict';

exports.pack = function(file) {
  var msg = file.path + ' is not supported. Supported files for nuget pack are: .nuspec, .csproj.';
  var supported = /^(\.nuspec|\.csproj)$/i;

  return supported(file, supported, msg);
};

exports.restore = function(file) {
  var basename = file.basename || '';
  if(basename.match(/^(package\.config|project\.json)$/i)) {
    return true;
  }

  var msg = file.path + ' is not supported. Supported files for nuget restore are: package.config, *.sln., project.json';
  var supported = /^(\.sln)$/i;

  return supported(file, supported, msg);
};

exports.push = function(file) {
  var msg = file.path + ' is not supported. Supported files for nuget push are: .nupkg';
  var supported = /^(\.nupkg)$/i;

  return supported(file, supported, msg);
};

function supported(file, supported, msg) {
	if(!file || !file.path) {
		return false;
	}

	var extension = file.extname || path.extname(file.path);

	if(!extension || !extension.match(supported)) {
		gutil.log(file.path + msg);
		return false;
	}

	return true;
}
