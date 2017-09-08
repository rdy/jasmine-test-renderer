// @flow
import gulp from 'gulp';
import {spawn} from 'child-process-promise';

gulp.task('foreman', () => {
  return spawn('node_modules/.bin/nf', ['start'], {stdio: 'inherit'});
});
