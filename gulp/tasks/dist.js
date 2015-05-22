var browserify = require('browserify');
var del = require('del');
var gulp = require('gulp');
var handleErrors = require('../util/handle-errors');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');

gulp.task('distClean', function(cb) {
    del('dist', cb);
});

gulp.task('dist', ['distClean', 'build'], function() {
    // Bundle the js for distribution and minify.
    browserify('./src/retro-mirror.js', {
        standalone: 'RetroMirror',
    })
        .bundle()
        .on('error', handleErrors)
        .pipe(source('retro-mirror.js'))
        .pipe(streamify(uglify()))
        .pipe(rename('retro-mirror.min.js'))
        .pipe(gulp.dest('./dist'));
});
