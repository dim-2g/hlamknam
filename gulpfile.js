'use strict';

var gulp        		   = require('gulp'),
	concat      		   = require('gulp-concat'),
	prefixer    		   = require('gulp-autoprefixer'),
	uglify      		   = require('gulp-uglify'),
	sass        		   = require('gulp-sass'),
	sourcemaps  		   = require('gulp-sourcemaps'),
	rigger      		   = require('gulp-rigger'),
	cleanCss    		   = require('gulp-clean-css'),
	imagemin    		   = require('gulp-imagemin'),
	pngquant    		   = require('imagemin-pngquant'),
	svgSprite 			   = require('gulp-svg-sprite'),
	svgmin 				   = require('gulp-svgmin'),
	rimraf      		   = require('rimraf'),
	replace     		   = require('gulp-replace'),
	browserSync 		   = require("browser-sync").create(),
	del 	    		   = require("del"),
	cache 	    		   = require("gulp-cache"),
	cheerio 			   = require('gulp-cheerio'),
	imageminJpegRecompress = require('imagemin-jpeg-recompress'),
	preprocess 			   = require('gulp-preprocess'),
	rename 				   = require('gulp-rename'),
	merge 				   = require('merge-stream'),
	spritesmith 		   = require('gulp.spritesmith');


var path = {
	//папка куда складываются готовые файлы
    build: { 
        html: 'build/',
        js: 'build/assets/template/js/',
        css: 'build/assets/template/css/',
        img: 'build/assets/template/images/',
        fonts: 'build/assets/template/fonts/',
		spritepng: 'build/assets/template/css/sprites/',
    },
    //папка откуда брать файлы
    src: {
		root: 'src/',
        html: 'src/assets/template/html/*.html',
        js: [
        'src/assets/template/vendor/jquery-3.2.1.min.js', 
        'src/assets/template/vendor/formstyler/jquery.formstyler.min.js', 
        'src/assets/template/vendor/jquery.inputmask.bundle.js',
        'src/assets/template/vendor/owlcarousel/owl.carousel.js',
        'src/assets/template/vendor/fancybox/jquery.fancybox.min.js',
        'src/assets/template/js/scripts.js',
        ],
        style: 'src/assets/template/css/*.scss',
		css_file: 'src/assets/template/css/',
        css: [
        	'src/assets/template/vendor/owlcarousel/owl.carousel.css',
			'src/assets/template/vendor/owlcarousel/owl.theme.default.css',
			'src/assets/template/vendor/slick/slick.css',
			'src/assets/template/vendor/slick/slick-theme.css',
			'src/assets/template/vendor/fancybox/jquery.fancybox.min.css',
			'src/assets/template/vendor/formstyler/jquery.formstyler.css',
			'src/assets/template/vendor/formstyler/jquery.formstyler.theme.css',
        	'src/assets/template/css/main.css',
		],
        img: 'src/assets/template/images/**/*.*',
		spritepng: 'src/assets/template/css/sprites/sprite.png',
		sprites: 'src/assets/template/sprites/*.*',
        fonts: 'src/assets/template/fonts/**/*.*'

    },
	dev: {
		sprites: 'src/assets/template/css/sprites/',
		spritescustom: 'src/assets/template/css/sprites/',
	},
    //указываем после измененя каких файлов нужно действовать
    watch: { 
        html: 'src/assets/template/html/*.html',
        js: 'src/js/**/*.js',
        style: 'src/assets/template/css/**/*.scss',
        css: 'src/css/**/*.css',
        img: 'src/img/**/*.*',
        svg: 'src/img/sprite/**/*.svg',
        fonts: 'src/fonts/**/*.*',
		sprites: 'src/assets/template/sprites/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build" //из какой папки показывать
    },
    tunnel: false,
    host: 'localhost', 
    port: 9002,
    open: true,
    notify: false,
    logPrefix: "gl"
};

var config_dev = {
	server: {
		baseDir: "./src" //из какой папки показывать
	},
	tunnel: false,
	host: 'localhost',
	port: 9001,
	open: true,
	notify: false,
	logPrefix: "app_dev"
};



function fonts(){
	return gulp.src(path.src.fonts)
				.pipe(gulp.dest(path.build.fonts));			
}

function images(){
	return gulp.src(path.src.img)
				.pipe(cache(imagemin([
			      imagemin.gifsicle({interlaced: true}),
			      imagemin.jpegtran({progressive: true}),
			      imageminJpegRecompress({
			        loops: 5,
			        min: 65,
			        max: 70,
			        quality:'medium'
			      }),
			      imagemin.svgo({
			      	plugins: [
				      	{cleanupIDs: false},
					    {removeUselessDefs: false},
					    {removeViewBox: true},
				    ]
			      }),
			      imagemin.optipng({optimizationLevel: 3}),
			      pngquant({quality: '65-70', speed: 5})
			    ],{
			      verbose: true
			    })))
				.pipe(gulp.dest(path.build.img))
				.pipe(browserSync.reload({stream: true}));
}
function copySprite(){
	return gulp.src(path.src.spritepng)
		.pipe(cache(imagemin([
			imagemin.optipng({optimizationLevel: 3}),
			pngquant({quality: '65-70', speed: 5})
		],{
			verbose: true
		})))
		.pipe(gulp.dest(path.build.spritepng));
}

function sprite(){
    return gulp.src('src/img/sprite/**/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
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
        
        .pipe(gulp.dest('src/img'))
        
}


function html(){
	return gulp.src(path.src.html)
				.pipe(rigger())
				.pipe(preprocess({context: {NODE_ENV: 'production', DEBUG: true}}))
				.pipe(gulp.dest(path.build.html));
				//.pipe(browserSync.reload({stream: true}));
}

function html_dev(){
	return gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(preprocess({context: {NODE_ENV: 'development', DEBUG: true}}))
		.pipe(gulp.dest(path.src.root));
	//.pipe(browserSync.reload({stream: true}));
}

function styles(){
	return gulp.src(path.src.style)
				//.pipe(sourcemaps.init())
				.pipe(sass())
				.pipe(prefixer({ 
				    cascade: false
				})) 
				.pipe(cleanCss({
					level: 2
				}))
				//.pipe(concat("app.css"))
				.pipe(concat("main.css"))
				// .pipe(sourcemaps.write())
				.pipe(gulp.dest(path.src.css_file))
				.pipe(browserSync.reload({stream: true}));
}

function scss(){
	return gulp.src(path.src.style)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(prefixer({
			cascade: false
		}))
		//.pipe(concat("main.css"))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.src.css_file))
		.pipe(browserSync.reload({stream: true}));
}

function css(){
	return gulp.src(path.src.css)

				.pipe(gulp.dest(path.build.css))
				.pipe(browserSync.reload({stream: true}));
}

function cssProduction(){
	return gulp.src(path.src.css)
		.pipe(prefixer({
			cascade: false
		}))
		.pipe(cleanCss({
			level: 2
		}))
		.pipe(concat("app.min.css"))
		//.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(path.build.css));
}

function scripts(){
	return gulp.src(path.src.js) 
				.pipe(rigger()) 
				.pipe(sourcemaps.init()) 
				.pipe(concat('all.js'))
				.pipe(uglify()) 
				.pipe(gulp.dest(path.build.js));
				//.pipe(browserSync.reload({stream: true}));
}

function spritePng() {
	var spriteData = gulp.src(path.src.sprites).pipe(spritesmith({
		imgName: 'sprite.png',
		imgPath: '/assets/template/css/sprites/sprite.png',
		cssName: 'sprite.scss'
	}));
	var imgStream = spriteData.img
		.pipe(gulp.dest(path.dev.sprites));

	var cssStream = spriteData.css
		.pipe(gulp.dest(path.dev.sprites));
	return merge(imgStream, cssStream);
}

function watch(){
	browserSync.init(config)
	gulp.watch(path.watch.style, styles);
	gulp.watch(path.watch.css, css);
	gulp.watch(path.watch.js, scripts);
	gulp.watch(path.watch.html, html);
	gulp.watch(path.watch.fonts, fonts);
	gulp.watch(path.watch.img, images);
	gulp.watch(path.watch.svg, sprite);
}

function watch_dev(){
	browserSync.init(config_dev)
	gulp.watch(path.watch.sprites, spritePng);
	gulp.watch(path.watch.style, styles);
	gulp.watch(path.watch.html, html_dev);
}

function clean(){
	return del(['build/*']);
}

gulp.task('fonts', fonts);
gulp.task('sprite', sprite);
gulp.task('images', images);
gulp.task('html', html);
gulp.task('styles', styles);
gulp.task('css', css);
gulp.task('css_prod', cssProduction);
gulp.task('scripts', scripts);
gulp.task('watch', watch);
gulp.task('clean', clean);
gulp.task('copy_sprite', copySprite);
gulp.task('sprite_png', spritePng);
gulp.task('html_dev', html_dev);
gulp.task('watch_dev', watch_dev);
gulp.task('scss', scss);

gulp.task('webserver:prod', function () {
	browserSync.init(config)
});

gulp.task('build', gulp.series(
	clean,
	spritePng,
	styles,
	gulp.parallel( cssProduction, copySprite, scripts, html, images, fonts),
	'webserver:prod'
));

gulp.task('dev', gulp.series(spritePng, scss, html_dev, watch_dev));

