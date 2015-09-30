var gulp = require('gulp');
var sass = require('gulp-sass');
var exec = require('child_process').exec;

var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var sprite = require('gulp.spritesmith');
var useref = require('gulp-useref');
var copy = require('gulp-copy');
var gulpif = require('gulp-if');

var runSequence = require('run-sequence');

/**
 * 开发环境
 */

gulp.task('server', function(cb) {
    // build Jekyll
    exec('jekyll serve').stdout.on('data', function(chunk) {
        console.log(chunk);
    });

    gulp.watch('static/scss/**/*.scss', ['sass']);

});

gulp.task('build', function(cb) {
    // build Jekyll
    exec('jekyll build').stdout.on('data', function(chunk) {
        console.log(chunk);
    });
});

gulp.task('sass', function() {
    // Gets all files ending with .scss in static/scss and children dirs
    return gulp.src('static/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('static/css'));
});

// Gulp watch syntax
gulp.task('watch', function(){
    // watchers
    gulp.watch('static/scss/*.scss', ['sass']);
});

gulp.task('sprite', function() {
    var spriteOutput =
        gulp.src("static/img/icon/*.png")
            .pipe(sprite({
                imgName: "sprite.png",
                cssName: "sprite.css",
                imgPath: "/static/img/sprite.png"
            }));

    spriteOutput.css.pipe(gulp.dest("static/css"));
    spriteOutput.img.pipe(gulp.dest("static/img"));
});

/**
 * 线上发布
 */

// 压缩、合并资源文件
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

gulp.task('copy2hello13', function(){
    // prefix前缀个数，保存目录避免在_layout下创建_layout
    return gulp.src('_site/**')
        .pipe(copy('../HELLO13/projects/party178', {prefix:1}));
});

// push到github
gulp.task('push2git', function(){
    var cmd = 'git add .;git commit -m "Gulp Deploy.";git push origin';
    exec(cmd, function(err, stdout) {
        if(err) {
            console.log('Git push:' + err);
        } else {
            console.log(stdout);
        }

    });
});

gulp.task('deploy', function(){
    runSequence('useref', 'build', 'copy2hello13', function(err){
        if(err) {
            console.log('Deploy error: ' + err);
            return;
        }

        console.log('Deploy complete.');
    });
});