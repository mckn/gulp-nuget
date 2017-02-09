[![Build Status](https://travis-ci.org/mckn/gulp-nuget.svg?branch=master)](https://travis-ci.org/mckn/gulp-nuget)

gulp-nuget
==========

**Version 1.0.0 have breaking changes so please check the release notes before updating**

This is hopefully all you need to get started with the plugin. If you think anything is missing or not working as described below, please open an issue or send a pull request...thanks!

First off, you will need nuget. Here is an example on how you can download it. Do this in a step prior to running the gulp-nuget plugin. If you already have it on the machine you could just skip this step.

```javascript

var gulp = require('gulp');
var request = require('request');
var fs = require('fs');

gulp.task('nuget-download', function(done) {
    if(fs.existsSync('nuget.exe')) {
        return done();
    }

    request.get('http://nuget.org/nuget.exe')
        .pipe(fs.createWriteStream('nuget.exe'))
        .on('close', done);
});

```

Then you can use the following commands:
* [pack](https://github.com/mckn/gulp-nuget#how-to-use-gulp-nuget-pack)
* [push](https://github.com/mckn/gulp-nuget#how-to-use-gulp-nuget-push)
* [restore](https://github.com/mckn/gulp-nuget#how-to-use-gulp-nuget-restore)

### How to use gulp-nuget pack:

Select the *.nuspec* or *.csproj* files you want to pack and pipe them to nuget pack. Stream the output from nuget pack to the place you want to save the package(s).

```javascript

var gulp = require('gulp');
var nuget = require('gulp-nuget');

gulp.task('nuget-pack', function() {
  var nugetPath = './path/to/nuget.exe';

  return gulp.src('project.nuspec')
    .pipe(nuget.pack({ nuget: nugetPath, version: "1.0.0" }))
    .pipe(gulp.dest('project.1.0.0.nupkg'));
});

```
An example when using the default options.

```javascript

var gulp = require('gulp');
var nuget = require('gulp-nuget');

gulp.task('nuget-pack', function() {
  return gulp.src('project.csproj')
    .pipe(nuget.pack())
    .pipe(gulp.dest('project.1.0.0.nupkg'));
});

```

##### Valid options for nuget pack
Options that have a default value is specified by a comment except of boolean values that are by default always false. The new temp folder that is used is ./gulp-nuget and should be added to your .gitignore file.

Read more about the options here:
http://docs.nuget.org/consume/command-line-reference#pack-command

```javascript

var options = {
  nuget: './path/to/nuget.exe', //./nuget.exe
  outputDirectory: './nupkgs/', //./gulp-nuget/
  version: '1.0.0',
  basePath: './',
  exclude: '**/*.designer.cs',
  properties: 'configuration=release',
  minClientVersion: '2.5',
  msBuildVersion: '12',
  verbosity: 'normal',
  build: true,
  symbols: true,
  excludeEmptyDirectories: true,
  includeReferencedProjects: true,
  noDefaultExcludes: true,
  tool: true,
};

var stream = nuget.pack(options);

```

### How to use gulp-nuget push:

You could choose to just push a single nuget package like this:

```javascript

var gulp = require('gulp');
var nuget = require('gulp-nuget');

gulp.task('nuget-pack', function() {
  var nugetPath = './path/to/nuget.exe';

  return gulp.src('project.1.0.0.nupkg')
    .pipe(nuget.push({ source: 'http://your-nuget-feed.org/', nuget: nugetPath, apiKey: 'secret-key-goes-here' }));
});

```

Or you could push multiple packages like this:

```javascript

var gulp = require('gulp');
var nuget = require('gulp-nuget');

gulp.task('nuget-pack', function() {
  var nugetPath = './path/to/nuget.exe';

  return gulp.src(['project.1.0.0.nupkg', 'project.1.1.0.nupkg'])
    .pipe(nuget.push({ source: 'http://your-nuget-feed.org/', nuget: nugetPath, apiKey: 'secret-key-goes-here' }));
});

```

##### Valid options for nuget push
Options that have a default value is specified by a comment except of boolean values that are by default always false.

Read more about the options here:
http://docs.nuget.org/consume/command-line-reference#push-command

```javascript

var options = {
  nuget: './path/to/nuget.exe', //./nuget.exe
  source: 'http://your-nuget-feed.org',
  apiKey: 'secret-key-goes-here',
  timeout: '300',
  configFile: '%AppData%/NuGet/NuGet.config',
  verbosity: 'normal',
};

var stream = nuget.push(options);

```

### How to use gulp-nuget pack then push:

If you don't want to save your nuget package you could push it directly by piping the output from pack to push. The name of the nuget package will be the name that's provided by nuget.exe. It would be project.1.0.0.nupkg in the example below.

```javascript

var gulp = require('gulp');
var nuget = require('gulp-nuget');

gulp.task('nuget-pack-n-push', function() {
  var nugetPath = './path/to/nuget.exe';

  return gulp.src('./project.nuspec')
    .pipe(nuget.pack({ nuget: nugetPath, version: '1.0.0' }))
    .pipe(nuget.push({ feed: 'http://your-nuget-feed.org/', nuget: nugetPath, apiKey: 'secret-key-goes-here' }));
});

```

### How to use gulp-nuget restore:

You can use restore by pipe **packages.config**, **project.json** or **\*.sln** file. The packages specified in the piped file will be restored according to given options.

```javascript

var gulp = require('gulp');
var nuget = require('gulp-nuget');

gulp.task('nuget-restore', function() {
  var nugetPath = './path/to/nuget.exe';

  return gulp.src('./project.sln')
    .pipe(nuget.restore({ nuget: nugetPath }));
});

```

##### Valid options for nuget restore
Options that have a default value is specified by a comment except of boolean values that are by default always false.

Read more about the options here:
http://docs.nuget.org/consume/command-line-reference#restore-command

```javascript

var options = {
  nuget: './path/to/nuget.exe', //./nuget.exe
  source: 'http://your-nuget-feed.org',
  configFile: '%appdata%/NuGet/nuget.config',
  packagesDirectory: './packages',
  solutionDirectory: './',
  msBuildVersion: '12',
  verbosity: 'normal',
  noCache: true,
  requireConsent: true,
  disableParallelProcessing: true
};

var stream = nuget.restore(options);

```

### Want to help?

Before submitting a pull request make sure the tests are green. Run them by using docker as described below:

```bash
# to get the source and build the docker image.
git clone git@github.com:mckn/gulp-nuget.git
cd gulp-nuget
docker-compose build

# to run the tests inside a container of the image
docker-compose run gulp-nuget npm test
```
