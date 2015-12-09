"use strict";

let gulp = require('gulp');
let exec = require('child_process').exec;

let uglify = require('gulp-uglify'),
    minify = require('gulp-minify-css'),
    sprite = require('gulp.spritesmith'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin');

let RevAll = require('gulp-rev-all');

/**
 * 构建过程
 */

// 生成雪碧图
gulp.task('sprite', () => {
    let spriteOutput =
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
gulp.task('md5', () => {
    let revAll = new RevAll({
        fileNameManifest: 'revision.json'
    });

    return gulp.src('src/static/js/**/*')
        .pipe(revAll.revision())
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest('src/_includes'));
});

// 切换环境
gulp.task('env', (end) => {
    const ENV = 'production';

    exec('sed -i.tmp \'s/^ENV:.*$/ENV: ' + ENV + '/\' _config.yml && rm _config.yml.tmp', (err, stdout) => {
        if (err) {
            console.log('Switch env: ' + err);
        } else {
            end();
        }
    });
});

// 生成线上文件
gulp.task('build', ['env','md5'], (end) => {
    // build Jekyll
    exec('jekyll build', (err, stdout) => {
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
    1、在/src目录中，生成文件配置文件revison.json，包括文件的MD5信息（版本信息）
    2、将/src文件build至发布环境/deploy，根据版本信息重命名文件
*/
gulp.task('scripts', ['build'], () => {
    let revAll = new RevAll({
        // 不更新require中js
        dontUpdateReference: ['.js']
    });

    return gulp.src('deploy/static/js/**/*')
        .pipe(revAll.revision())
        .pipe(uglify())
        .pipe(gulp.dest('deploy/static/js'));
});

// 构建/deploy目录下css文件
gulp.task('styles', ['build'], (end) => {
    return gulp.src('deploy/static/css/**/*')
        .pipe(minify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('deploy/static/css'));
});

// 构建/deploy目录下img文件
gulp.task('images', ['build'], (end) => {
    return gulp.src('deploy/static/img/post/*')
        .pipe(imagemin({
            optimizationLevel: 1
        }))
        .pipe(gulp.dest('deploy/static/img/post'));
});