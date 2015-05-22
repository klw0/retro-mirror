/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   If the watch task is running, this uses watchify instead
   of browserify for faster bundling using caching.
*/

var browserify = require('browserify');
var bundleLogger = require('../util/bundle-logger');
var gulp = require('gulp');
var handleErrors = require('../util/handle-errors');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

gulp.task('browserify', function() {
    var bundler = browserify({
        standalone: 'RetroMirror',
        // Required watchify args
        cache: {}, packageCache: {}, fullPaths: true,
        // Specify the entry point of your app
        entries: ['./src/retro-mirror.js'],
        // Enable source maps
        debug: true,
    });

    var bundle = function() {
        // Log when bundling starts
        bundleLogger.start();

        return bundler
            .bundle()
            // Report compile errors
            .on('error', handleErrors)
            // Use vinyl-source-stream to make the
            // stream gulp compatible. Specify the
            // desired output filename here.
            .pipe(source('retro-mirror.js'))
            // Specify the output destination
            .pipe(gulp.dest('build'))
            // Log when bundling completes!
            .on('end', bundleLogger.end);
    };

    if (global.isWatching) {
        bundler = watchify(bundler);
        // Rebundle with watchify on changes.
        bundler.on('update', bundle);
    }

    return bundle();
});
