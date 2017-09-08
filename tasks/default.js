// @flow
import './flow';
import './lint';
import './prettier';
import './spec';
import gulp from 'gulp';

gulp.task('default', gulp.series('lint', 'flow', 'prettier', 'spec'));
