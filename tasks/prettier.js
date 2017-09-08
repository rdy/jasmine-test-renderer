import gulp from 'gulp';
import prettier from 'gulp-nf-prettier';
import prettierOptions from '../config/prettier.json';

gulp.task('prettier', () => {
  return gulp
    .src(['src/**/*.js', 'spec/**/*.js', 'tasks/**/*.js'], {
      base: '.',
    })
    .pipe(prettier(prettierOptions))
    .pipe(gulp.dest('.'));
});
