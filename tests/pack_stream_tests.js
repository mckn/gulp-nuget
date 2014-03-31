var proxyquire = require('proxyquire'),
	assert = require("assert");

var stubs = {
		'./pack-cmd': {
			run: function(options, cb) {
				this.options = options;
				cb({ pack: 'fake' });
			}
		},
		'./log': function(output) {
			this.output = output;
		},
		'fs-extra': {
			outputFile: function(copyTo, content, cb) {
				this.copyTo = copyTo;
				this.content = content;
				cb();
			},
			remove: function(workingDirectory, cb) {
				this.workingDirectory = workingDirectory;
				cb();
			}
		}
	},
	packStream = proxyquire('../lib/pack', stubs);

describe('when pushing files to nuget pack stream', function() {
	var options = { 
			workingDirectory: './nuget', 
			nuget: 'nuget.exe', 
			nuspec: 'nuspecFile.nuspec', 
			version: '1.0.0' 
		},
		stream;

	before(function() {
		stream = packStream(options);
		stream.write({ path: '../index.js', _content: 'asdf' });
		stream.end();
	});

	it('should call nuget pack cmd with correct options', function() {
		assert.deepEqual(stubs['./pack-cmd'].options, options);
	});

	it('should call nuget pack with correct options', function() {
		assert.equal(stubs['fs-extra'].copyTo, 'nuget\\index.js');
	});
});