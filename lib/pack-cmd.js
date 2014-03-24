var exec = require('child_process').exec,
	gutil = require('gulp-util'),
	log = require('./log'),
	File = require('vinyl'),
	fs = require('fs-extra');

function create(options) {
	var cmd = options.nuget + ' pack ' + options.nuspec;
	if(options.version) {
		cmd += ' -version ' + options.version;
	}
	cmd += ' -nopackageanalysis -noninteractive';
	
	return cmd;
}

function getPackageFilePath(stdout) {
	var regexp = /'(.+\.nupkg)'/;

	if(!stdout) {
		return;
	}

	var matches = stdout.match(regexp);
	if(!matches.length || matches.length < 1) {
		return;
	}

	return matches[1];
}

function readPackage(filePath, callback) {
	fs.exists(filePath, function(exists) {
		if(!exists) {
			callback();
			return;
		}

		fs.readFile(filePath, function(err, data) {
			var nugetPackage = new File({
				base: path.dirname(filePath),
				path: filePath,
				contents: data
			});

			callback(nugetPackage);
		});
	});
}

function run(options, callback) {
	exec(cmd, function(err, stdout, stderr) {
		if(err) {
			throw new gutil.PluginError(stderr);
		}

		log(stdout);

		var filePath = getPackageFilePath(stdout);
		readPackage(filePath, callback);
	});
}

modules.export = {
	create: create,
	run: run
};