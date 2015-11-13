var gulp = require('gulp');
var exec = require('child_process').exec;

var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var sprite = require('gulp.spritesmith');
var useref = require('gulp-useref');
var copy = require('gulp-copy');
var gulpif = require('gulp-if');

var runSequence = require('run-sequence');

var RevAll = require('gulp-rev-all');


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

// 生成MD5版本号config.json
gulp.task('md5', function() {

    var revAll = new RevAll({
        fileNameManifest: 'manifest.json'
    });

    return gulp.src('src/static/js/**/*')
        .pipe(revAll.revision())
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest('src/_includes'));
});

// 生成线上文件
gulp.task('build', ['md5'], function(end) {
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

// 构建/deploy目录下资源文件
gulp.task('uglify', ['build'], function() {

    var revAll = new RevAll({
        // 不更新require中js
        dontUpdateReference: [ '.js']
    });

    return gulp.src('deploy/static/js/**/*')
        .pipe(revAll.revision())
        .pipe(uglify())
        .pipe(gulp.dest('deploy/static/js'));
});

// deploy到美团云
gulp.task('cp2cloud', ['build'], function(end) {

    var SERVER_URL = 'root@43.241.219.90',
        LOCAL_PATH = '/Users/hello13/Documents/Proj/HELLO13/deploy/*',
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