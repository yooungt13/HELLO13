var gulp = require('gulp');
var sass = require('gulp-sass');
var exec = require('child_process').exec;

gulp.task('default', function() {
    // place code for your default task here
});

gulp.task('server', function(cb) {
    // build Jekyll
    exec('jekyll serve').stdout.on('data', function(chunk) {
        console.log(chunk);
    });

    gulp.watch('static/scss/**/*.scss', ['sass']);

});

gulp.task('sass', function() {
    // Gets all files ending with .scss in static/scss and children dirs
    return gulp.src('static/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('static/css'));
});

// Gulp watch syntax
gulp.task('watch', function(){
    gulp.watch('static/scss/**/*.scss', ['sass']);
    // Other watchers
});