
// package vars
const pkg = require('./package.json');

// gulp
const gulp = require('gulp');

// load all plugins in "devDependencies" into the varaible $
const $ = require('gulp-load-plugins')({
    pattern: ['*'],
    scope: ['devDependencies']
});

const onError = (err) => {
    console.log(err);
}

// const banner = [
//     "/**",
//     " *",
//     " * @package"
// ].join("\n");


// scss - build the scss to the build forder, including the required paths, and write out a sourcemap
gulp.task('scss', () => {
    $.fancyLog('-> Compiling scss...');
    return gulp.src([pkg.paths.src.scss + '**/*.scss', '!' + pkg.paths.src.scss + '**/_*'])
        .pipe($.plumber({errorHandler: onError}))
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.sass({
            errLogToConsole: true,
            outputStyle: 'expanded',
            precision: 10
        }))
        .pipe($.cached('sass_compile'))
        .pipe($.autoprefixer({
            cascade: false
        }))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(pkg.paths.build.css))
});

// css task - combine & minimize any distribution CSS into the public css folder, and add our banner to it
gulp.task('css', ['scss'], () => {
    $.fancyLog('-> Building css...');
    return gulp.src(pkg.globs.distCss)
        .pipe($.plumber({errorHandler: onError}))
        .pipe($.newer({dest: pkg.paths.dist.css + pkg.vars.siteCssName}))
        .pipe($.print.default())
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.concat(pkg.vars.siteCssName))
        .pipe($.cssnano())
        // .pipe($.header())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(pkg.paths.dist.css))
        .pipe($.filter('**/*.css'))
        .pipe($.browserSync.reload({stream: true}))
});

// babel js task - transpile our Javascript into the build directory
gulp.task('js-babel', () => {
    $.fancyLog('-> Transpiling Javascript via Babel...');
    return gulp.src(pkg.globs.babelJs)
        .pipe($.plumber({errorHandler: onError}))
        .pipe($.newer({dest: pkg.paths.build.js}))
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.babel())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(pkg.paths.build.js));
});

// js task - minimize any distribution Javascript into the public js folder, and add our banner to it
gulp.task("js", ["js-babel"], () => {
    $.fancyLog("-> Building js...");
    return gulp.src(pkg.globs.distJs)
        .pipe($.plumber({errorHandler: onError}))
        .pipe($.if(["*.js", "!*.min.js"],
            $.newer({dest: pkg.paths.dist.js, ext: ".min.js"}),
            $.newer({dest: pkg.paths.dist.js})
        ))
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.if(["*.js", "!*.min.js"],
            $.uglify()
        ))
        .pipe($.if(["*.js", "!*.min.js"],
            $.rename({suffix: ".min"})
        ))    
        // .pipe($.header(banner, {pkg: pkg}))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(pkg.paths.dist.js))
        .pipe($.filter("**/*.js"))
        .pipe($.browserSync.reload({stream: true}));
});

// imagemin task
gulp.task("imagemin", () => {
    return gulp.src(pkg.paths.src.img + "**/*.{png,jpg,jpeg,gif,svg}")
        .pipe($.imagemin({
            progressive: true,
            interlaced: true,
            optimizationLevel: 7,
            svgoPlugins: [{removeViewBox: false}],
            verbose: true,
            use: []
        }))
        .pipe(gulp.dest(pkg.paths.dist.img));
});


// Hhtml minify
gulp.task('html', () => {
    return gulp.src(pkg.paths.src.base + '*.html')
        .pipe($.htmlmin())
        .pipe(gulp.dest(pkg.paths.dist.base))
        .pipe($.browserSync.reload({stream: true}));
});

// Browser sync
gulp.task('browser-sync', () => {
    $.browserSync.init({
        server: {
            baseDir: 'public/'
        }
    })
})

// Reload
gulp.task('bs-reload', () => {
    $.browserSync.reload();
});

// Default task
gulp.task('default', ['imagemin','js', 'css', 'html', 'browser-sync'], () => {
    gulp.watch([pkg.paths.src.scss + '**/*.scss'], ['css']);
    gulp.watch([pkg.paths.src.css + '**/*.css'], ['css']);
    gulp.watch([pkg.paths.src.js + '**/*.js'], ['js']);
    gulp.watch([pkg.paths.src.img + '**/*.{png,jpg,jpeg,gif,svg}'], ['imagemin']);
    gulp.watch([pkg.paths.src.base + '*.html'], ['html']);
});