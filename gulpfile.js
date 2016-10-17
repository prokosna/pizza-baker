var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');
var webpack = require('gulp-webpack');
var named = require('vinyl-named');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var library = {
    base: "node_modules",
    destination: "./public/lib",
    source: [
        require.resolve('bootstrap/dist/css/bootstrap.css'),
        require.resolve('bootstrap/dist/css/bootstrap.min.css')
    ]
}

var tsProject = ts.createProject('tsconfig.json');

var paths = {
    root: "./scripts/",
    dest: "./public/"
};

paths.srcTsx = paths.root + "src/**/entry.tsx";
paths.destTsx = paths.dest + "javascripts/";


gulp.task('clean:js', function () {
    del(['./scripts/build'])
    del(['./scripts/dest'])
});

gulp.task('clean:lib', function () {
    del(['./public/lib'])
});

gulp.task('lib', ['clean:lib'], function () {
    return gulp.src(library.source, {base: library.base})
        .pipe(gulp.dest(library.destination));
});

gulp.task('ts', ['clean:js'], function () {
    return gulp.src(['scripts/src/js/**/*.{ts,tsx}'], {base: 'scripts/src/js'})
        .pipe(ts(tsProject))
        .js
        .pipe(gulp.dest('scripts/build/js'));
});

gulp.task('bundle', ['ts'], function () {
    return gulp.src(['./scripts/build/js/main.js'], {base: './scripts/build/js'})
        .pipe(named(function (file) {
            return file.relative.replace(/\.[^\.]+$/, '');
        }))
        .pipe(webpack({
            output: {
                filename: '[name].bundle.js'
            },
            devtool: 'source-map',
            resolve: {
                extensions: ['', '.js']
            }
        }))
        .pipe(gulp.dest('./scripts/dest/js'));
});

gulp.task('uglify', ['bundle'], function() {
    return gulp.src(['./scripts/dest/js/*.js'])
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js'}))
        .pipe(gulp.dest('./scripts/dest/js/'));
});

gulp.task('copy', ['uglify'], function () {
    gulp.src(['./scripts/dest/js/**/*.min.js'], {base: './scripts/dest/js'})
        .pipe(gulp.dest('./public/javascripts'));
});

gulp.task('default', ['copy', 'lib']);