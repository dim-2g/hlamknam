'use strict';

// Подключение плагинов
var gulp = require('gulp'),
    gulpsync = require('gulp-sync')(gulp),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rjs = require('gulp-requirejs'),
    //uglify = require('gulp-uglify'),
    uglify = require('gulp-uglify-es').default,
    concat = require('gulp-concat'),
    copy = require('gulp-contrib-copy'),
    preprocess = require('gulp-preprocess'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    spritesmith = require('gulp.spritesmith'),
    merge = require('merge-stream'),
    livereload = require('gulp-livereload'),
    rename = require('gulp-rename'),
    rigger = require('gulp-rigger'),
    plumber = require('gulp-plumber'),
    svgSprite = require('gulp-svg-sprite'),
    svgmin = require('gulp-svgmin'),
    cheerio                = require('gulp-cheerio'),
    replace                = require('gulp-replace');

// Пути для сборки
var path = {
    build: {
        root: 'public/',
        js: 'public/assets/template/js/',
        rjs: 'build.js',
        css: 'public/assets/template/css/',
        img: 'public/assets/template/img/',
        sprites: 'public/assets/template/img/sprites/',
        spritescustom: 'public/assets/template/img/sprites_custom/',
    },
    src: {
        root: 'src/',
        html: 'src/assets/template/html/**/*.html',
        js: 'src/assets/template/js/**/*.js',
        rjs: 'src/assets/template/js/',
        scripts: 'src/assets/template/scripts/**/*.js',
        sass: 'src/assets/template/css/*.scss',
        css: 'src/assets/template/css/',
        img: 'src/assets/template/img/**/*.*',
        requirejsLib: 'src/assets/template/lib/require.js',
        lib: '../lib/',
        tpl: '../tpl/',
        sprites: 'src/assets/template/sprites/*.*',
        spritesvg: 'src/assets/template/spritesvg/**/*.svg',
        spritescustom: 'src/assets/template/sprites_custom/*.*',
    },
    dev: {
        sprites: 'src/assets/template/css/sprites/',
        spritescustom: 'src/assets/template/css/sprites/',
    },
    watch: {
        html: 'src/assets/template/html/**/*.html',
        sass: 'src/assets/template/css/**/*.scss',
        sassd: 'src/assets/template/css/*.scss',
        js: 'src/assets/template/js/**/*.js',
        tpl: 'src/assets/template/tpl/**/*.html',
        sprites: 'src/assets/template/sprites/*.*',
        spritescustom: 'src/assets/template/sprites_custom/*.*',
        spritesvg: 'src/assets/template/spritesvg/*.*',
    },
    clean: ['public', 'src/assets/template/css/main.css', 'src/assets/template/css/sprites/', 'src/assets/template/css/sprites_custom/', 'src/assets/template/*.html']
};

// Конфиги для локального вебсервера
var webserver = {
    dev: {
        server: {
            baseDir: './src'
        },
        tunnel: false,
        host: 'localhost',
        port: 9001,
        logPrefix: 'app_dev'
    },
    prod: {
        server: {
            baseDir: './public'
        },
        tunnel: true,
        host: 'localhost',
        port: 9002,
        logPrefix: 'app_prod'
    }
};

gulp.task('sprite-dis', function() {
    return gulp.src(path.src.spritesvg)
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        /*
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        */
        .pipe(replace('&gt;', '>'))
        .pipe(svgSprite({
            shape: {
                transform: []
            },
            mode: {
                symbol: {
                    sprite: "../sprite.svg",
                }
            }
        }))
        
        .pipe(gulp.dest(path.dev.sprites))
        
});

// Очистка папок и файлов
gulp.task('clean', function() {
    return gulp.src(path.clean, {read: false})
        .pipe(clean());
});

// Компиляция sass, сборка стилей
// development
gulp.task('sass:dev', function() {
    return gulp.src(path.src.sass)
        .pipe(plumber())
        //.pipe(sourcemaps.init())
        .pipe(sass())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(path.src.css))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('sass:dev2', function() {
    return gulp.src(path.src.sass)
        .pipe(plumber())
        //.pipe(sourcemaps.init())
        .pipe(sass())
        //.pipe(sourcemaps.write())
        //.pipe(sass({outputStyle: 'compressed'}))
        //.pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.src.css))
        .pipe(browserSync.reload({stream: true}));
});

// production
gulp.task('sass:prod', ['sprite:prod'], function() {
    return gulp.src(path.src.sass)
        .pipe(sass())
        //сохраняем в css
        .pipe(gulp.dest(path.build.css))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(rename({suffix: '.min'}))
        //сохраняем и минифицированную версию
        .pipe(gulp.dest(path.build.css));
});

// Сборка requirejs
gulp.task('requirejs:build', function() {
    rjs({
        baseUrl: path.src.rjs,
        name: 'main',
        out: path.build.rjs,
        paths: {
            jquery: path.src.lib + 'jquery',
            lodash: path.src.lib + 'lodash',
            backbone: path.src.lib + 'backbone',
            text: path.src.lib + 'text',
            tpl: path.src.tpl
        },
        shim: {
            lodash: {
                exports: '_'
            },
            backbone: {
                deps: [
                    'lodash',
                    'jquery'
                ],
                exports: 'Backbone'
            }
        },
        map: {
            '*': {
                'underscore': 'lodash'
            }
        }
    })
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js));
});

// Копирование библиотеки require.js для production
gulp.task('requirejs:copy_lib', function() {
    gulp.src(path.src.requirejsLib)
        .pipe(copy())
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js));
});

// Оптимизация изображений
gulp.task('img', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img));
});

// Склеивание сторонних скриптов
gulp.task('scripts', function() {
    return gulp.src(path.src.scripts)
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js));
});

// Препроцессинг html
// development
gulp.task('html:dev', function() {
    gulp.src(path.src.html)
        .pipe(rigger()) //Прогоним через rigger
        .pipe(preprocess({context: {NODE_ENV: 'development', DEBUG: true}}))
        .pipe(gulp.dest(path.src.root))
        .pipe(browserSync.reload({stream: true}));
});

// production
gulp.task('html:prod', function() {
    gulp.src(path.src.html)
        .pipe(rigger()) //Прогоним через rigger
        .pipe(preprocess({context: {NODE_ENV: 'production', DEBUG: true}}))
        .pipe(gulp.dest(path.build.root))
});

gulp.task('sprite:dev', function () {
  var spriteData = gulp.src(path.src.sprites).pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '/assets/template/css/sprites/sprite.png',
    cssName: 'sprite.scss'
  }));
  var imgStream = spriteData.img
    //.pipe(buffer())
    //.pipe(imagemin())
    .pipe(gulp.dest(path.dev.sprites));

  var cssStream = spriteData.css
    //.pipe(csso())
    .pipe(gulp.dest(path.dev.sprites));
  return merge(imgStream, cssStream);
  //return spriteData.pipe(gulp.dest(path.tmp.sprites));
});

gulp.task('spritecustom:dev', function () {
    var spriteData = gulp.src(path.src.spritescustom).pipe(spritesmith({
      imgName: 'sprite_custom.png',
      imgPath: '/assets/template/css/sprites/sprite_custom.png',
      cssName: 'sprite_custom.scss'
    }));
    var imgStream = spriteData.img.pipe(gulp.dest(path.dev.spritescustom));
    var cssStream = spriteData.css.pipe(gulp.dest(path.dev.spritescustom));
    return merge(imgStream, cssStream);
});

gulp.task('sprite:prod', function () {
  var spriteData = gulp.src(path.src.sprites).pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '/assets/template/img/sprites/sprite.png',
    cssName: 'sprite.scss'
  }));
  var imgStream = spriteData.img
    //.pipe(buffer())
    //.pipe(imagemin())
    .pipe(gulp.dest(path.build.sprites));

  var cssStream = spriteData.css
    //.pipe(csso())
    .pipe(gulp.dest(path.dev.sprites));
  return merge(imgStream, cssStream);
  //return spriteData.pipe(gulp.dest(path.tmp.sprites));
});



// watch-таска
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:dev');
    });
    watch([path.watch.sass], function(event, cb) {
        gulp.start('sass:dev');
    });
    watch([path.watch.sassd], function(event, cb) {
        gulp.start('sass:dev');
    });
    /*
    watch([path.watch.sprites], function(event, cb) {
        gulp.start('sprite:dev');
    });
    */
    //watch([path.watch.js, path.watch.tpl]).on('change', browserSync.reload);
});

gulp.task('watch2', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:dev');
    });
    watch([path.watch.sass], function(event, cb) {
        gulp.start('sass:dev2');
    });
    watch([path.watch.sassd], function(event, cb) {
        gulp.start('sass:dev2');
    });
    watch([path.watch.sprites], function(event, cb) {
        gulp.start('sprite:dev');
    });
    watch([path.watch.spritesvg], function(event, cb) {
        gulp.start('sprite');
    });
    //watch([path.watch.js, path.watch.tpl]).on('change', browserSync.reload);
});

// Запуск локального веб-сервера
// development
gulp.task('webserver:dev', function () {
    browserSync(webserver.dev);
});

// production
gulp.task('webserver:prod', function () {
    browserSync(webserver.prod);
});

gulp.task('js', function () {
    return gulp.src([
        'src/assets/template/vendor/jquery-3.2.1.min.js', 
        'src/assets/template/vendor/slick/slick.js',
        'src/assets/template/vendor/jquery.inputmask.bundle.js',
        'src/assets/template/vendor/fancybox/jquery.fancybox.min.js',
        ])
        .pipe(uglify())
        .pipe(concat('build.js'))
        .pipe(gulp.dest('src/assets/template/vendor/'));
});

gulp.task('css', function () {
    return gulp.src([
        'src/assets/template/vendor/slick/slick.css', 
        'src/assets/template/vendor/owlcarousel/owl.carousel.min.css',
        'src/assets/template/vendor/owlcarousel/owl.theme.default.min.css',
        'src/assets/template/vendor/slick/slick-theme.css',
        'src/assets/template/vendor/fancybox/jquery.fancybox.min.css',
        ])
        .pipe(concat('build.css'))
        .pipe(gulp.dest('src/assets/template/vendor/'));
});

gulp.task('develop', gulpsync.sync([
    //'spritecustom:dev',
    'sprite:dev',
    [
        'html:dev',
        'sass:dev'
    ],
    'watch2',
    'webserver:dev'
]));

gulp.task('develop2', gulpsync.sync([
    //'spritecustom:dev',
    //'sprite',
    'sprite:dev',
    [
        'html:dev',
        'sass:dev2'
    ],
    'watch2',
    'webserver:dev'
]));

// Режим production
gulp.task('production', gulpsync.sync([
    'clean',
    [
        'html:prod',
        'sass:prod',
        //'requirejs:build',
        //'requirejs:copy_lib',
        'img',
        'scripts'
    ],
    'webserver:prod'

]));