'use strict';

exports.pack = function(nuspecFile, options) {
	var args = ['pack', nuspecFile];

	var withoutValues = [
		'build',
		'symbols',
		'excludeEmptyDirectories',
		'includeReferencedProjects',
		'noDefaultExcludes',
		'tool'
	];

	var withValues = [
		'version',
		'outputDirectory',
		'basePath',
		'exclude',
		'properties',
		'minClientVersion',
		'msBuildVersion',
		'verbosity'
	];

	withValues.forEach(function(prop) {
		var value = options[prop];
		if(value) {
			args.push('-' + prop);
			args.push(value);
		}
	});

	withoutValues.forEach(function(prop) {
		var value = options[prop];
		if(value) {
			args.push('-' + prop);
		}
	});

	args.push('-nopackageanalysis');
	args.push('-noninteractive');

	return args;
};

exports.push = function(nupkg, options) {
	var args = ['push', nupkg];

	var withValues = [
		'source',
		'apiKey',
		'timeout',
		'configFile',
		'verbosity'
	];

	withValues.forEach(function(prop) {
		var value = options[prop];
		if(value) {
			args.push('-' + prop);
			args.push(value);
		}
	});

	args.push('-noninteractive');

	return args;
};

exports.restore = function(nupkg, options) {
	var args = ['restore', nupkg];

	var withValues = [
		'source',
		'configFile',
		'packagesDirectory',
		'solutionDirectory',
		'msBuildVersion',
		'verbosity'
	];

	var withoutValues = [
		'noCache',
		'requireConsent',
		'disableParallelProcessing'
	];

	withValues.forEach(function(prop) {
		var value = options[prop];
		if(value) {
			args.push('-' + prop);
			args.push(value);
		}
	});

	withoutValues.forEach(function(prop) {
		var value = options[prop];
		if(value) {
			args.push('-' + prop);
		}
	});

	args.push('-noninteractive');

	return args;
};
