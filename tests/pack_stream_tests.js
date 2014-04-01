var path = require('path'),
	assert = require("assert"),
	File = require("vinyl"),
	map = require('vinyl-map'),
	fs = require('fs'),
	packStream = require('../lib/pack');

describe('when pushing files to nuget pack stream', function() {
	var nuspecFile,
		options,
		file;

	var processStream = function(done) {
		var stream = packStream(options);

		stream.pipe(map(function(code, filename) {
			nuspecFile = {
				path: filename,
				contents: code
			};
			done();
		}));

		stream.write(file);
		stream.end();
	};

	before(function() {
		options = { 
			workingDirectory: '../tools/nuget', 
			nuget: '../tools/nuget.exe'
		};

		file = new File({ 
			cwm: '../', 
			base: '../', 
			path: '../testing.js', 
			contents: new Buffer('testing') 
		});
	});

	describe('and version is set in nuspecfile', function() {

		before(function(done) {
			options.nuspec = '../tools/with-version.nuspec';

			processStream(done);
		});

		it('should create nuget package and pushing it down the pipeline', function() {
			assert.equal(nuspecFile.contents.length, 2563);
			assert.equal(path.basename(nuspecFile.path), 'gulp.nuget.1.0.0.nupkg');
		});

		it('should create nuget package and store it on disk', function() {
			assert.equal(fs.existsSync(nuspecFile.path), true);
		});

		after(function(done) {
			fs.unlink(nuspecFile.path, done);
		});

	});

	describe('and version is set in options', function() {
		
		before(function(done) {
			options.nuspec = '../tools/without-version.nuspec';
			options.version = '1.1.1';

			processStream(done);
		});

		it('should create nuget package and pushing it down the pipeline', function() {
			assert.equal(nuspecFile.contents.length, 2564);
			assert.equal(path.basename(nuspecFile.path), 'gulp.nuget.1.1.1.nupkg');
		});

		it('should create nuget package and store it on disk', function() {
			assert.equal(fs.existsSync(nuspecFile.path), true);
		});

		after(function(done) {
			fs.unlink(nuspecFile.path, done);
		});

	});

	describe('and package.json is passed as a file', function() {
		
		before(function(done) {
			options.version = "1.2.2";

			file = new File({
				cwm: '../', 
				base: '../', 
				path: '../package.json', 
				contents: new Buffer('{}') 
			});

			processStream(done);
		});

		it('should create nuget package with _package.json file in it (due to nuget ignoring package.json)', function() {
			assert.equal(nuspecFile.contents.length, 2566);
			assert.equal(path.basename(nuspecFile.path), 'gulp.nuget.1.2.2.nupkg');
		});

		after(function(done) {
			fs.unlink(nuspecFile.path, done);
		});

	});

});


describe('when creating nuget pack stream', function() {
	var options;

	beforeEach(function() {
		options = { 
			workingDirectory: '../tools/nuget', 
			nuget: '../tools/nuget.exe',
			version: '1.0.0',
			nuspec: 'nuspecFile.nuspec'
		};
	});

	describe('and nuspec is missing from options', function() {

		it('should throw exception', function() {
			options.nuspec = false;
			assert.throws(function() { packStream(options); });
		});

	});

	describe('and nuget is missing from options', function() {

		it('should throw exception', function() {
			options.nuget = false;
			assert.throws(function() { packStream(options); });
		});

	});

});