// @flow
import babel from 'gulp-babel';
import del from 'del';
import gulp from 'gulp';
import production from '../config/babel/production.json';

gulp.task('clean-build', () => del('dist'));

gulp.task('transpile', () => {
  return gulp.src('src/**/*.js', {base: 'src'}).pipe(babel(production)).pipe(gulp.dest('dist'));
});

gulp.task('build', gulp.series('clean-build', 'transpile'));
