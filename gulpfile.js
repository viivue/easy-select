const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const rename = require("gulp-rename");
const uglify = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');


// uglify JS
gulp.task('uglify', function(){
    return gulp.src(['build/*.js'])
        .pipe(rename({extname: '.min.js'}))
        .pipe(uglify(/* options */))
        .pipe(gulp.dest("dist"));
});

// minify css
gulp.task('minify-css', () => {
    return gulp.src('build/*.css')
        .pipe(rename({extname: '.min.css'}))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist'));
});

// watch all files
gulp.task('watch', function(){
    gulp.watch('**').on('change', () => {
        browserSync.reload();
    });

    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

// gulp serve
gulp.task('serve', gulp.series('watch'));

// gulp release
gulp.task('release', gulp.series('uglify', 'minify-css'));