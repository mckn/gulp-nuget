'use strict';

var assert = require("chai").assert;
var proxyquire = require('proxyquire');
var File = require("vinyl");
var map = require('vinyl-map');
var cproc = {
		execFile: function(file, args, cb) {
			this.file = file;
			this.args = args;
			cb(null, 'success');
		}
  };
var pushStream = proxyquire('../lib/push', { 'child_process': cproc });


describe('when pushing nuget package to push stream', function() {
	var nugetPkg;
	var pushedNugetPkg;
	var options;
  var file;

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
			nuget: 'nuget',
			source: 'http://localhost',
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
      var expected = ['push', '../testing.nupkg',
        '-apiKey','asdfasdfasfd',
        '-source','http://localhost',
        '-noninteractive'];

			assert.sameMembers(cproc.args, expected);
		});

		it('should call push cmd mock with correct nuget package path', function() {
			assert.deepEqual(cproc.file, 'nuget');
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
