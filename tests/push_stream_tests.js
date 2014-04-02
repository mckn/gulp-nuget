var assert = require("assert"),
	proxyquire = require('proxyquire'),
	File = require("vinyl"),
	map = require('vinyl-map'),
	pushcmdStub = {
		run: function(file, options, cb) {
			this.file = file;
			this.options = options;
			cb();
		}
	},
	pushStream = proxyquire('../lib/push', { './push-cmd': pushcmdStub });


describe('when pushing nuget package to push stream', function() {
	var nugetPkg,
		pushedNugetPkg,
		options;

	var processStream = function(done) {
		var stream = pushStream(options);

		stream.pipe(map(function(code, filename) {
			pushedNugetPkg = {
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
			nuget: '../tools/nuget.exe',
			feed: 'http://localhost',
			apiKey: 'asdfasdfasfd'
		};

		file = new File({ 
			cwm: '../', 
			base: '../', 
			path: '../testing.nupkg', 
			contents: new Buffer('testing') 
		});
	});

	describe('and push cmd is mocked', function() {

		before(function(done) {
			processStream(done);
		});

		it('should call push cmd mock with correct options', function() {
			assert.deepEqual(pushcmdStub.options, options);
		});

		it('should call push cmd mock with correct nuget package path', function() {
			assert.deepEqual(pushcmdStub.file, file.path);
		});

	});

	describe('and stream is piped', function() {

		before(function(done) {
			processStream(done);
		});

		it('should push nuget package to the next stream', function() {
			assert.equal(pushedNugetPkg.path, '../testing.nupkg');
		});

		it('should push nuget package to the next stream', function() {
			assert.equal(pushedNugetPkg.contents.length, 7);
		});
	});

});


describe('when creating nuget push stream', function() {
	var options;

	beforeEach(function() {
		options = { 
			nuget: '../tools/nuget.exe',
			feed: 'http://localhost'
		};
	});

	describe('and feed is missing from options', function() {

		it('should throw exception', function() {
			options.feed = false;
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