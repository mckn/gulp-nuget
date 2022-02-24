var path = require('path');
var assert = require("assert");
var File = require("vinyl");
var map = require('vinyl-map');
var fs = require('fs-extra');
var nuget = require('../');

describe('when restoring packages.config file with restore', function() {
  this.timeout(30000);

	function restorePackages(done) {
    var file = new File({
      cwm: './',
      base: './test/configs/',
      path: './test/configs/packages.config',
      contents: new Buffer.from('')
    });

    var stream = nuget.restore({ nuget: 'nuget', packagesDirectory: './.gulp-nuget/packages/' });
    stream.pipe(map(function(code, file){ console.log(file); }));
    stream.on('end', done);
		stream.write(file);
		stream.end();
	}

  before(restorePackages);

  it('should restore packages', function(done) {
    fs.existsSync('./.gulp-nuget/packages/Newtonsoft.Json.12.0.3', function (exists) {
      assert.ok(exists);
    });
    done();
  });

  after(function(done) {
    fs.remove('./.gulp-nuget', done);
  });
});
