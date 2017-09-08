// @flow
import {colors, log} from 'gulp-util';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import gulpIf from 'gulp-if';

gulp.task('lint', () => {
  const fix = !['false', false].includes(process.env.FIX);
  return gulp
    .src(['src/**/*.js', 'spec/**/*.js', 'tasks/**/*.js'], {base: '.'})
    .pipe(eslint({fix}))
    .pipe(eslint.format('stylish'))
    .pipe(
      gulpIf(file => {
        const fixed = file.eslint && typeof file.eslint.output === 'string';
        if (fixed) {
          log(colors.yellow(`fixed an error in ${file.eslint.filePath}`));
          return true;
        }
        return false;
      }, gulp.dest('.'))
    )
    .pipe(eslint.failAfterError());
});
