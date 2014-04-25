gulp-nuget
==========

Nuget support for gulp streaming build system. You need to provide nuget.exe and I would recommend you to download it from http://nuget.org/nuget.exe. It could be done in a step prior to your nuget pack or nuget push step(s).

Here's an example:

```javascript

var gulp = require('gulp'),
    request = require('request'),
    fs = require('fs');
    
gulp.task('getnuget', function(done) {
    if(fs.existsSync('nuget.exe')) {
        done();
        return;
    }

    request.get('http://nuget.org/nuget.exe')
        .pipe(fs.createWriteStream('nuget.exe'))
        .on('close', done);
});

```

### How to use gulp-nuget:

Once you have nuget (downloaded or provided by a other path) you could use the gulp-nuget plugin. Select the files you want to pack and send them do nuget pack. 

```javascript

var gulp = require('gulp'),
    nuget = require('gulp-nuget');
    
gulp.task('nugetpack', function() {
    gulp.src(['./*.js', './package.json'])
        .pipe(nuget.pack({ nuspec: 'project.nuspec', nuget: './path/to/nuget.exe', version: '1.0.0' }))
        .pipe(gulp.dest('project.1.0.0.nupkg'));
});

```
