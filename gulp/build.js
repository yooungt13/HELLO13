var gulp = require('gulp');
var exec = require('child_process').exec;

var uglify = require('gulp-uglify'),
    minify = require('gulp-minify-css'),
    sprite = require('gulp.spritesmith'),
    rename = require('gulp-rename');

var RevAll = require('gulp-rev-all');

/**
 * 构建过程
 */

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

// 生成MD5版本号revision.json
gulp.task('md5', function() {
    var revAll = new RevAll({
        fileNameManifest: 'revision.json'
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

/*
    构建/deploy目录下js文件
    1、在/src目录中，生成文件配置文件config.json，包括文件的MD5信息（版本信息）
    2、将/src文件build至发布环境/deploy，根据版本信息重命名文件
*/
gulp.task('scripts', ['build'], function() {
    var revAll = new RevAll({
        // 不更新require中js
        dontUpdateReference: ['.js']
    });

    return gulp.src('deploy/static/js/**/*')
        .pipe(revAll.revision())
        .pipe(uglify())
        .pipe(gulp.dest('deploy/static/js'));
});

// 构建/deploy目录下css文件
gulp.task('styles', ['build'], function(end) {
    return gulp.src('deploy/static/css/**/*')
        .pipe(minify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('deploy/static/css'));
});


