'use strict';

exports.findNupkgs = function(stdout) {
  var matches = [];
  var nupkg = new RegExp('\'(.+\.nupkg)\'', 'ig');

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
