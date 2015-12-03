var gulp = require('gulp');
var exec = require('child_process').exec;

var sass = require('gulp-sass');

/**
 * 开发环境
 */
gulp.task('server', function() {
    // build Jekyll
    exec('jekyll serve').stdout.on('data', function(chunk) {
        console.log(chunk);
    });

    gulp.watch('src/static/scss/**/*.scss', ['sass']);
});

gulp.task('sass', function() {
    // Gets all files ending with .scss in src/static/scss and children dirs
    return gulp.src('src/static/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/static/css'));
});

// Gulp watch syntax
gulp.task('watch', function() {
    // watchers
    gulp.watch('src/static/scss/**/*.scss', ['sass']);
});
