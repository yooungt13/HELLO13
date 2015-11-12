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

    gulp.watch('src/static/scss/**/*.scss', ['sass']);
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
    // Gets all files ending with .scss in src/static/scss and children dirs
    return gulp.src('src/static/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/static/css'));
});

// Gulp watch syntax
gulp.task('watch', function() {
    // watchers
    gulp.watch('src/static/scss/*.scss', ['sass']);
});

// 生成雪碧图
gulp.task('sprite', function() {
    var spriteOutput =
        gulp.src("src/static/img/icon/*.png")
        .pipe(sprite({
            imgName: 'sprite.png',
            cssName: 'sprite.css',
            imgPath: '/src/static/img/sprite.png'
        }));

    spriteOutput.css.pipe(gulp.dest('src/static/css'));
    spriteOutput.img.pipe(gulp.dest('src/static/img'));
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

    var data = require('./src/static/json/firebase-data.json');

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

    return gulp.src('src/static/elements/friend-list/index.html')
        .pipe(vulcanize({
            abspath: '',
            excludes: [],
            stripExcludes: false,
            inlineScripts: true,
            inlineCss: true,
        }))
        .pipe(gulp.dest('src/static/elements/friend-list'));
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
gulp.task('push2git', function(end) {
    var cmd = 'git add .;git commit -m "Gulp deploy.";git pull origin;git push origin';
    exec(cmd, function(err, stdout) {
        if (err) {
            console.log('Git push:' + err);
        } else {
            console.log(stdout);
            end();
        }
    });
});

// deploy到美团云
gulp.task('cp2cloud', ['build'], function(end) {

    var SERVER_URL = 'root@43.241.219.90',
        LOCAL_PATH = '/Users/hello13/Documents/Proj/HELLO13/_site/*',
        REMOTE_PATH = '/usr/share/nginx/html';

    var cmd = 'scp -r ' + LOCAL_PATH + ' ' + SERVER_URL + ':' + REMOTE_PATH;

    exec(cmd, function(err, stdout) {
        if (err) {
            console.log('Git push: ' + err);
        } else {
            console.log('Copy complete.');
            end();
        }
    });
});

gulp.task('truck', function(end) {
    /*
    1、在/src目录中，生成文件配置文件config.json，包括文件的MD5信息（版本信息）
    2、将/src文件copy至发布环境/deploy，根据版本信息重命名文件
    3、为所有文件增加数据元信息 \/*__meta__*\/
    4、扫描所有文件，生成文件依赖关系树
    5、生成版本号
    */
});

gulp.task('deploy', function(end) {
    runSequence('useref', 'push2git', 'cp2cloud', function(err) {
        if (err) {
            console.log('Deploy error: ' + err);
        } else {
            console.log('Deploy complete.');
            end();
        }
    });
});