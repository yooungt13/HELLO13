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

gulp.task('server', function() {
    // build Jekyll
    exec('jekyll serve').stdout.on('data', function(chunk) {
        console.log(chunk);
    });

    gulp.watch('static/scss/**/*.scss', ['sass']);
});

gulp.task('build', function(end) {
    // build Jekyll
    exec('jekyll build', function(err, stdout) {
        if (err) {
            console.log('Jekyll build: ' + err);
        } else {
            console.log(stdout);
            end();
        }
    });
});

gulp.task('sass', function() {
    // Gets all files ending with .scss in static/scss and children dirs
    return gulp.src('static/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('static/css'));
});

// Gulp watch syntax
gulp.task('watch', function() {
    // watchers
    gulp.watch('static/scss/*.scss', ['sass']);
});

// 生成雪碧图
gulp.task('sprite', function() {
    var spriteOutput =
        gulp.src("static/img/icon/*.png")
        .pipe(sprite({
            imgName: 'sprite.png',
            cssName: 'sprite.css',
            imgPath: '/static/img/sprite.png'
        }));

    spriteOutput.css.pipe(gulp.dest('static/css'));
    spriteOutput.img.pipe(gulp.dest('static/img'));
});

// 连接线上数据库
// ref: https://www.firebase.com/account/#/
var Firebase = require('firebase'),
    FIREBASE_URL = 'https://hello13.firebaseio.com/',
    fref = new Firebase(FIREBASE_URL);

gulp.task('getdata', function() {
    // Attach an asynchronous callback to read the data at our posts reference
    fref.on('value', function(snapshot) {
        console.log(snapshot.val());
    }, function(errorObject) {
        console.log('The read failed: ' + errorObject.code);
    });
});

gulp.task('setdata', function() {

    var data = require('./static/json/firebase-data.json');

    fref.set(data, function(err) {
        if (err) {
            console.log('Data of firebase update failed');
        } else {
            console.log('Data of firebase update succeeded');
        }
    });
});

gulp.task('vulcanize', function() {
    var vulcanize = require('gulp-vulcanize');

    return gulp.src('static/elements/friend-list/index.html')
        .pipe(vulcanize({
            abspath: '',
            excludes: [],
            stripExcludes: false,
            inlineScripts: true,
            inlineCss: true,
        }))
        .pipe(gulp.dest('static/elements/friend-list'));
});

/**
 * 线上发布
 */

// 压缩、合并资源文件
gulp.task('useref', function() {
    var assets = useref.assets();

    return gulp.src('_layouts/default.html', {
            base: './'
        })
        .pipe(assets)
        // Minifies only if it's a CSS file
        .pipe(gulpif('*.css', minifyCSS()))
        // Uglifies only if it's a Javascript file
        .pipe(gulpif('*.js', uglify()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('./'));
});

gulp.task('backup', function() {
    // prefix前缀个数，保存目录避免在_layout下创建_layout
    return gulp.src('_layouts/default.html')
        .pipe(copy('backup', {
            prefix: 1
        }));
});

// push到github
gulp.task('push2git', function() {
    var cmd = 'git add .;git commit -m "Gulp deploy.";git pull origin;git push origin';
    exec(cmd, function(err, stdout) {
        if (err) {
            console.log('Git push:' + err);
        } else {
            console.log(stdout);
        }
    });
});

// deploy到美团云
gulp.task('cp2cloud', function() {

    var SERVER_URL = 'root@43.241.219.90',
        LOCAL_PATH = '/Users/hello13/Documents/Proj/HELLO13/_site/*',
        REMOTE_PATH = '/usr/share/nginx/html';

    var cmd = 'scp -r ' + LOCAL_PATH + ' ' + SERVER_URL + ':' + REMOTE_PATH;

    exec(cmd, function(err, stdout) {
        if (err) {
            console.log('Git push: ' + err);
        } else {
            console.log('Copy complete.');
        }
    });
});

gulp.task('deploy', function() {
    runSequence('useref', 'build', 'push2git', function(err) {
        if (err) {
            console.log('Deploy error: ' + err);
        } else {
            console.log('Deploy complete.');
        }
    });
});