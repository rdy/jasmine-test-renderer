// @flow
import gulp from 'gulp';
import {spawn} from 'child-process-promise';

gulp.task('flow', () => spawn('node_modules/.bin/flow', {stdio: 'inherit'}));
