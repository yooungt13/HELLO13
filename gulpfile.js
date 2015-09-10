var gulp = require('gulp');
var sass = require('gulp-sass');
var exec = require('child_process').exec;

var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');

gulp.task('default', function() {
    // place code for your default task here
});

gulp.task('server', function(cb) {
    // build Jekyll
    exec('jekyll serve').stdout.on('data', function(chunk) {
        console.log(chunk);
    });

    gulp.watch('static/scss/*.scss', ['sass']);

});

gulp.task('sass', function() {
    // Gets all files ending with .scss in static/scss and children dirs
    return gulp.src('static/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('static/css'));
});

// Gulp watch syntax
gulp.task('watch', function(){
    gulp.watch('static/scss/*.scss', ['sass']);
    // Other watchers
});

gulp.task('useref', function(){
  var assets = useref.assets();

  return gulp.src('_layouts/default.html', {base:'./'})
    .pipe(assets)
    // Minifies only if it's a CSS file
    .pipe(gulpif('*.css', minifyCSS()))
    // Uglifies only if it's a Javascript file
    .pipe(gulpif('*.js', uglify()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('./'));
});

gulp.task('deploy', function(){
    var cmd = 'git add .;git commit -m "deploy test";git push origin';
    exec(cmd, function(err, stdout, stderr) {
        if(err) {
            console.log('Git push:' + err);
        } else {
            console.log(stdout);
        }

    });
    // Other watchers
});
