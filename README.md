gulp-nuget
==========
This is just a quick draft to get you all started with the plugin. I will improve the documentation later on...thanks!

First off, you will need nuget. Here is a example on how you can download it in a previous step before running the gulp-nuget plugin. If you already have it on the machine you could just add a path to it instead and skip this step.

Here's an example:

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

### How to use gulp-nuget pack:

Once you have nuget (downloaded or provided by a other path) you could use the gulp-nuget plugin. Select the files you want to pack and send them do nuget pack. 

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

If you don't want to save your nuget package you could push it directly by piping the output from pack to push. The name of the nuget package will be the name that is provided by nuget.exe. In our example that would be project.1.0.0.nupkg.

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
