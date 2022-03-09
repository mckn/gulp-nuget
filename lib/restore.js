"use strict";

var through = require("through2");
var cproc = require("child_process");
var log = require("fancy-log");
var PluginError = require("plugin-error");
var argsFor = require("./argsFor");
var validFor = require("./validFor");

module.exports = function (options) {
  options = options || {};
  options.nuget = options.nuget || "./nuget.exe";
  options.maxBuffer = options.maxBuffer || 200 * 1024;

  return through.obj(function (file, encoding, done) {
    if (!validFor.restore(file)) {
      return done(null, file);
    }

    var args = argsFor.restore(file.path, options);
    var opts = { maxBuffer: options.maxBuffer };

    cproc.execFile(options.nuget, args, opts, function (err, stdout) {
      if (err) throw new PluginError("gulp-nuget", err);

      log(stdout.trim());
      done(null, file);
    });
  });
};
