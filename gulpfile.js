var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('sass', function () {
    return gulp.src('assets/sass/main.sass')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('public/css'))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('public/css'));
});

gulp.task('jsApp', function () {
    return gulp.src('assets/js/**/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public/js'))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/js'));
});

gulp.task('jsLib', function () {
    return gulp.src([
            'node_modules/jquery/dist/jquery.js',
            'node_modules/semantic-ui-css/semantic.js',

            'assets/sass/**/*.js',
        ])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('public/js'))
        .pipe(rename('lib.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/js'));
});

gulp.task('watch', function () {
    gulp.watch('assets/sass/**/*.+(sass|scss)', gulp.parallel('sass'));
    gulp.watch('assets/sass/**/*.js', gulp.parallel('jsLib'));
    gulp.watch('assets/js/**/*.js', gulp.parallel('jsApp'));
});

gulp.task('default', gulp.series(['sass', 'jsLib', 'jsApp', 'watch']));
// gulp.task('default', ['watch']);