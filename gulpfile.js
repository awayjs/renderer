var gulp = require('gulp');
var glob = require('glob');
var path = require('path');
var browserify  = require('browserify');
var source = require('vinyl-source-stream');
var transform = require('vinyl-transform');
var exorcist = require('exorcist');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var watchify = require('watchify');
var livereload = require('gulp-livereload');

var typescript = require('gulp-typescript');

var shell = require('gulp-shell');
var git = require('gulp-git');
var watch;

gulp.task('package', function(callback){
    watch = false;
    browserifyShare(callback);
});

gulp.task('package-min', ['package'], function(callback){
    return gulp.src('./build/awayjs-renderergl.js')
        .pipe(sourcemaps.init({loadMaps:true}))
        .pipe(uglify({compress:false}))
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(sourcemaps.write({sourceRoot: '../'}))
        .pipe(transform(function() {
            return exorcist('./build/awayjs-renderergl.min.js.map');
        }))
        .pipe(gulp.dest('./build'));
});

gulp.task('package-watch', function(callback){
    watch = true;
    browserifyShare(callback);
});

gulp.task('watch', ['package-watch'], function(){

    //Start live reload server
    livereload.listen();
});

gulp.task('tests', function () {

    var tsProject = typescript.createProject({
        declarationFiles: true,
        noExternalResolve: true,
        target: 'ES5',
        module: 'commonjs',
        sourceRoot: './'
    });

    var tsResult = gulp.src(['./tests/**/*.ts', './node_modules/awayjs-**/build/*.d.ts', './build/awayjs-renderergl.d.ts'])
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject));

    return tsResult.js
        .pipe(sourcemaps.write({sourceRoot: './tests'}))
        .pipe(gulp.dest('./tests'));
});

function browserifyShare(callback) {
    var b = browserify({
        debug: true,
        paths: ['../'],
        cache: {},
        packageCache: {},
        fullPaths: true
    });

    b.plugin('tsify', {target:'ES5', sourceRoot:'../', noExternalResolve: true, declarationFiles: './node_modules/awayjs-**/build/*.d.ts', declarationOutput: './build/awayjs-renderergl.d.ts'});

    glob('./node_modules/awayjs-**/lib/**/*.ts', {}, function (error, files) {
        files.forEach(function (file) {
            b.external(file);
        });
    });

    glob('./lib/**/*.ts', {}, function (error, files) {

        files.forEach(function (file) {
            b.require(file, {expose:unixStylePath(path.relative('../', file.slice(0,-3)))});
        });

        if (watch) {
            b = watchify(b);
            b.on('update', function(){
                return b.bundle()
                    .pipe(source('awayjs-renderergl.js'))
                    .pipe(gulp.dest('./build'))
                    .pipe(livereload());
            });
        }

        b.bundle()
            .pipe(exorcist('./build/awayjs-renderergl.js.map'))
            .pipe(source('awayjs-renderergl.js'))
            .pipe(gulp.dest('./build'))
            .on('end', callback);
    });
}

function unixStylePath(filePath) {
    return filePath.split(path.sep).join('/');
}

gulp.task('commit', ['package-min'], function(callback){

    git.status({args:'--porcelain'}, function(err, stdout) {
        var buildModified = false;
        var packageModified = false;

        if (err)
            throw err;

        stdout = stdout.split('\n');
        stdout.forEach(function (line) {
            if (line.indexOf('build/') != -1)
                buildModified = true;
            else if (line.indexOf(' M ') != -1)
                packageModified = true;
        });

        if (packageModified) {
            console.log('un-commited changes detected in package');
            console.log('Please git commit all changes outside of build before continuing');
        } else {
            if (buildModified) {
                gulp.src('./build/*')
                    .pipe(git.commit('update build files'))
                    .on('error', function(err) {
                        throw err;
                    })
                    .on('end', callback);
            } else {
                callback();
            }
        }
    });
});

gulp.task('version', ['commit'], function(callback){
    gulp.src('')
        .pipe(shell([
            'npm version patch'
        ])).on('error', function(err) {
            throw err;
        }).on('end', callback);
});

gulp.task('push', ['version'], function(callback){
    gulp.src('')
        .pipe(shell([
            'git push origin dev --tags'
        ])).on('error', function(err) {
            throw err;
        }).on('end', callback);
});

gulp.task('publish', ['push'], function(callback){
    gulp.src('')
        .pipe(shell([
            'npm publish'
        ])).on('error', function(err) {
            throw err;
        }).on('end', callback);
});