var path = require("path");
var assert = require("assert");
var File = require("vinyl");
var map = require("vinyl-map");
var fs = require("fs");
var nuget = require("../");

describe("when pushing nuspec file to nuget pack stream", function () {
  var nupkgs = [];

  function packFile(nuspecFile, options, done) {
    fs.readFile(nuspecFile, function (err, data) {
      if (err) return done(err);

      var nuspec = new File({
        cwm: "/",
        base: "/test/",
        path: nuspecFile,
        contents: data,
      });

      var stream = nuget.pack(options);

      stream.pipe(
        map(function (contents, path) {
          nupkgs.push({ path: path, contents: contents });
        })
      );

      stream.on("end", done);
      stream.write(nuspec);
      stream.end();
    });
  }

  describe("and version is set in nuspec file", function () {
    before(function (done) {
      nupkgs = [];
      options = { nuget: "nuget", outputDirectory: "./" };
      packFile("./test/nuspecs/with-version.nuspec", options, done);
    });

    it("should create nuget package and pushing it down the pipeline", function () {
      assert.equal(path.basename(nupkgs[0].path), "gulp.nuget.1.0.0.nupkg");
    });

    it("should create nuget package and store it on disk", function () {
      assert.equal(fs.existsSync(nupkgs[0].path), true);
    });

    after(function (done) {
      fs.unlink(nupkgs[0].path, done);
    });
  });

  describe("and version is set in options", function () {
    before(function (done) {
      nupkgs = [];
      options = { nuget: "nuget", outputDirectory: "./", version: "1.1.1" };
      packFile("./test/nuspecs/without-version.nuspec", options, done);
    });

    it("should create nuget package and pushing it down the pipeline", function () {
      assert.equal(path.basename(nupkgs[0].path), "gulp.nuget.1.1.1.nupkg");
    });

    it("should create nuget package and store it on disk", function () {
      assert.equal(fs.existsSync(nupkgs[0].path), true);
    });

    after(function (done) {
      fs.unlink(nupkgs[0].path, done);
    });
  });

  describe("and suffix is set in options", function () {
    before(function (done) {
      nupkgs = [];
      options = {
        nuget: "nuget",
        outputDirectory: "./",
        version: "1.1.1",
        suffix: "nightly",
      };
      packFile("./test/nuspecs/without-version.nuspec", options, done);
    });

    it("should create nuget package and pushing it down the pipeline", function () {
      assert.equal(
        path.basename(nupkgs[0].path),
        "gulp.nuget.1.1.1-nightly.nupkg"
      );
    });

    it("should create nuget package and store it on disk", function () {
      assert.equal(fs.existsSync(nupkgs[0].path), true);
    });

    after(function (done) {
      fs.unlink(nupkgs[0].path, done);
    });
  });

  describe("and symbols is set in options", function () {
    before(function (done) {
      nupkgs = [];
      options = { nuget: "nuget", symbols: true };
      packFile("./test/nuspecs/with-version.nuspec", options, done);
    });

    it("should create nuget package and symbols", function () {
      assert.equal(nupkgs.length, 2);
    });
  });
});
