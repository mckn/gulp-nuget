var path = require('path');
var assert = require("assert");
var File = require("vinyl");
var map = require('vinyl-map');
var fs = require('fs');
var pack = require('../lib/pack');

describe('when pushing nuspec file to nuget pack stream', function() {

	describe.only('and version is set in nuspec file', function() {
		var nupkg;

		before(function(done) {
			fs.readFile('./nuspecs/with-version.nuspec', function(err, data) {
				if(err) return done(err);

				var stream = pack();
				stream.pipe(map(function(contents, path) {
					nupkg = { path, contents };
				}));
				stream.on('end', done);
				stream.write(new File({
					cwm: './',
					base: './',
					path: './nuspecs/with-version.nuspec',
					contents: data
				}));
				stream.end();
			});
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

	// describe('and version is set in options', function() {
	//
	// 	before(function(done) {
	// 		options.version = '1.1.1';
	//
	// 		processStream(done);
	// 	});
	//
	// 	it('should create nuget package and pushing it down the pipeline', function() {
	// 		assert.equal(nuspecFile.contents.length, 2564);
	// 		assert.equal(path.basename(nuspecFile.path), 'gulp.nuget.1.1.1.nupkg');
	// 	});
	//
	// 	it('should create nuget package and store it on disk', function() {
	// 		assert.equal(fs.existsSync(nuspecFile.path), true);
	// 	});
	//
	// 	after(function(done) {
	// 		fs.unlink(nuspecFile.path, done);
	// 	});
	//
	// });

});


// describe('when creating nuget pack stream', function() {
// 	var options;
//
// 	beforeEach(function() {
// 		options = {
// 			workingDirectory: '../tools/nuget',
// 			nuget: '../tools/nuget.exe',
// 			version: '1.0.0',
// 			nuspec: 'nuspecFile.nuspec'
// 		};
// 	});
//
// 	describe('and nuspec is missing from options', function() {
//
// 		it('should throw exception', function() {
// 			options.nuspec = false;
// 			assert.throws(function() { packStream(options); });
// 		});
//
// 	});
//
// 	describe('and nuget is missing from options', function() {
//
// 		it('should throw exception', function() {
// 			options.nuget = false;
// 			assert.throws(function() { packStream(options); });
// 		});
//
// 	});
//
// });
