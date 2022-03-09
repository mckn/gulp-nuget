"use strict";

var log = require("fancy-log");
var path = require("path");

exports.pack = function (file) {
  var msg =
    file.path +
    " is not supported. Supported files for nuget pack are: .nuspec, .csproj.";
  var regexp = /^(\.nuspec|\.csproj)$/i;

  return supported(file, regexp, msg);
};

exports.restore = function (file) {
  var basename = path.basename(file.path);
  if (basename.match(/^(packages\.config|project\.json)$/i)) {
    return true;
  }

  var msg =
    file.path +
    " is not supported. Supported files for nuget restore are: packages.config, *.sln., project.json";
  var regexp = /^(\.sln)$/i;

  return supported(file, regexp, msg);
};

exports.push = function (file) {
  var msg =
    file.path + " is not supported. Supported files for nuget push are: .nupkg";
  var regexp = /^(\.nupkg)$/i;

  return supported(file, regexp, msg);
};

function supported(file, regexp, msg) {
  if (!file || !file.path) {
    return false;
  }

  var extension = file.extname || path.extname(file.path);

  if (!extension || !extension.match(regexp)) {
    log(file.path + msg);
    return false;
  }

  return true;
}
