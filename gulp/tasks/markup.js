var gulp = require('gulp');

gulp.task('markup', function() {
    return gulp.src('index.html')
        .pipe(gulp.dest('build'));
});
