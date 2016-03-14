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
		'verbosity',
		'minClientVersion',
		'msBuildVersion'
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
