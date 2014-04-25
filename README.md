gulp-nuget
==========
This is just a quick draft to get you all started with the plugin. I will improve the documentation later on...thanks!

First off, you will need nuget. Here is an example on how you can download it. Do this in a step prior to running the gulp-nuget plugin. If you already have it on the machine you could just add the path to it instead and skip this step.

```javascript

var gulp = require('gulp'),
    request = require('request'),
    fs = require('fs');
    
gulp.task('nuget-download', function(done) {
    if(fs.existsSync('nuget.exe')) {
        done();
        return;
    }

    request.get('http://nuget.org/nuget.exe')
        .pipe(fs.createWriteStream('nuget.exe'))
        .on('close', done);
});

```

Once you have nuget (downloaded or provided by a other path) you could use the gulp-nuget plugin.

### How to use gulp-nuget pack:

Select the files you want to pack and pipe them do nuget pack. Pipe the nuget.pack stream out to where you want to save the nuget package.

```javascript

var gulp = require('gulp'),
    nuget = require('gulp-nuget');
    
gulp.task('nuget-pack', function() {
    var nugetPath = './path/to/nuget.exe';
    
    gulp.src(['./*.js', './package.json'])
        .pipe(nuget.pack({ nuspec: 'project.nuspec', nuget: nugetPath, version: '1.0.0' }))
        .pipe(gulp.dest('project.1.0.0.nupkg'));
});

```

### How to use gulp-nuget push:

You could choose to just push a single nuget package like this:

```javascript

var gulp = require('gulp'),
    nuget = require('gulp-nuget');
    
gulp.task('nuget-pack', function() {
    var nugetPath = './path/to/nuget.exe';
    
    gulp.src('project.1.0.0.nupkg')
        .pipe(nuget.push({ feed: 'http://your-nuget-feed.org/', nuget: nugetPath, apiKey: 'secret-key-goes-here' }));
});

```

Or you could push multiple packages like this:

```javascript

var gulp = require('gulp'),
    nuget = require('gulp-nuget');
    
gulp.task('nuget-pack', function() {
    var nugetPath = './path/to/nuget.exe';
    
    gulp.src(['project.1.0.0.nupkg', 'project.1.1.0.nupkg'])
        .pipe(nuget.push({ feed: 'http://your-nuget-feed.org/', nuget: nugetPath, apiKey: 'secret-key-goes-here' }));
});

```

### How to use gulp-nuget pack then push:

If you don't want to save your nuget package you could push it directly by piping the output from pack to push. The name of the nuget package will be the name that's provided by nuget.exe. It would be project.1.0.0.nupkg in the example below.

```javascript

var gulp = require('gulp'),
    nuget = require('gulp-nuget');
    
gulp.task('nuget-pack-n-push', function() {
    var nugetPath = './path/to/nuget.exe';

    gulp.src(['./*.js', './package.json'])
        .pipe(nuget.pack({ nuspec: 'project.nuspec', nuget: nugetPath, version: '1.0.0' }))
        .pipe(nuget.push({ feed: 'http://your-nuget-feed.org/', nuget: nugetPath, apiKey: 'secret-key-goes-here' }));
});

```

### Possible ways to configure nuget with this plugin.

#### gulp-nuget pack

```javascript

var options = {
    nuspec: 'project.nuspec', // path to nuspec file (required)
    nuget: 'nuget.exe', // path to nuget.exe (required)
    version: '1.0.0', // if you want to set the version by command line (not required).
    workingDirectory: './temp' // temp folder used fore files to be packed. (not required - default: ./publish)
};

```

#### gulp-nuget push

```javascript

var options = {
    nuget: 'nuget.exe', // path to nuget.exe (required)
    feed: 'http://mynugetfeed.org/', //url to the feed where you want to publish your nuget package (required)
    apiKey: 'api-key' // api key to your nuget package feed. See nuget.org for other ways to set this key (not required).
};

```
