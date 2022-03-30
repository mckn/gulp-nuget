"use strict";

exports.pack = function (nuspecFile, options) {
  var args = ["pack", nuspecFile];

  var withoutValues = [
    "build",
    "symbols",
    "excludeEmptyDirectories",
    "includeReferencedProjects",
    "noDefaultExcludes",
    "tool",
    "nonInteractive"
  ];

  var withValues = [
    "version",
    "outputDirectory",
    "basePath",
    "exclude",
    "properties",
    "minClientVersion",
    "msBuildVersion",
    "verbosity",
    "suffix",
    "symbolPackageFormat"
  ];

  withValues.forEach(function (prop) {
    var value = options[prop];
    if (value) {
      args.push("-" + prop);
      args.push(value);
    }
  });

  withoutValues.forEach(function (prop) {
    var value = options[prop];
    if (value) {
      args.push("-" + prop);
    }
  });

  args.push("-nopackageanalysis");

  return args;
};

exports.push = function (nupkg, options) {
  var args = ["push", nupkg];

  var withValues = ["source", "apiKey", "timeout", "configFile", "verbosity"];
  var withoutValues = ["nonInteractive"];

  withValues.forEach(function (prop) {
    var value = options[prop];
    if (value) {
      args.push("-" + prop);
      args.push(value);
    }
  });

  withoutValues.forEach(function (prop) {
    var value = options[prop];
    if (value) {
      args.push("-" + prop);
    }
  });

  return args;
};

exports.restore = function (nupkg, options) {
  var args = ["restore", nupkg];

  var withValues = [
    "source",
    "configFile",
    "packagesDirectory",
    "solutionDirectory",
    "msBuildVersion",
    "verbosity",
  ];

  var withoutValues = [
    "noCache",
    "requireConsent",
    "disableParallelProcessing",
    "nonInteractive"
  ];

  withValues.forEach(function (prop) {
    var value = options[prop];
    if (value) {
      args.push("-" + prop);
      args.push(value);
    }
  });

  withoutValues.forEach(function (prop) {
    var value = options[prop];
    if (value) {
      args.push("-" + prop);
    }
  });

  return args;
};
