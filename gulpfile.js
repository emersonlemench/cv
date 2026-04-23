const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const header = require('gulp-header');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const pkg = require('./package.json');

const banner = ['/*!\n',
  ' * CV Emerson Méndez v<%= pkg.version %>\n',
  ' */\n',
  ''
].join('');

function compileSass() {
  return gulp.src('scss/resume.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(header(banner, { pkg }))
    .pipe(gulp.dest('css'));
}

function minifyCSS() {
  return gulp.src('css/resume.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('css'));
}

function minifyJS() {
  return gulp.src('js/resume.js')
    .pipe(uglify())
    .pipe(header(banner, { pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('js'));
}

function copyVendors(done) {
  gulp.src(['node_modules/bootstrap/dist/**/*', '!**/*.map'])
    .pipe(gulp.dest('vendor/bootstrap'));
  gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('vendor/jquery'));
  gulp.src(['node_modules/jquery-easing/jquery.easing.min.js'])
    .pipe(gulp.dest('vendor/jquery-easing'));
  gulp.src(['node_modules/font-awesome/**', '!node_modules/font-awesome/**/*.map',
    '!node_modules/font-awesome/.npmignore', '!node_modules/font-awesome/*.txt',
    '!node_modules/font-awesome/*.md', '!node_modules/font-awesome/*.json'])
    .pipe(gulp.dest('vendor/font-awesome'));
  gulp.src(['node_modules/devicons/**/*', '!node_modules/devicons/*.json', '!node_modules/devicons/*.md'])
    .pipe(gulp.dest('vendor/devicons'));
  gulp.src(['node_modules/simple-line-icons/**/*',
    '!node_modules/simple-line-icons/*.json', '!node_modules/simple-line-icons/*.md'])
    .pipe(gulp.dest('vendor/simple-line-icons'));
  done();
}

const build = gulp.series(copyVendors, compileSass, minifyCSS, minifyJS);

exports.sass = compileSass;
exports.copyVendors = copyVendors;
exports.build = build;
exports.default = build;
