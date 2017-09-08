// @flow
import {headless, server, specRunner} from 'gulp-jasmine-browser';
import JasminePlugin from 'gulp-jasmine-browser/webpack/jasmine-plugin';
import del from 'del';
import gulp from 'gulp';
import minimist from 'minimist';
import plumber from 'gulp-plumber';
import portastic from 'portastic';
import test from '../config/webpack/test';
import {obj as through} from 'through2';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';

gulp.task('clear-jasmine', () => del('tmp/jasmine/**'));

gulp.task('run-jasmine', () => {
  const config = test();
  const plugin = config.plugins.find(plugin => plugin instanceof JasminePlugin);
  return gulp
    .src('spec/jasmine-test-renderer/index.js')
    .pipe(plumber())
    .pipe(webpackStream({watch: true, quiet: true, config}, webpack))
    .pipe(specRunner({sourcemappedStacktrace: true}))
    .pipe(server({whenReady: plugin.whenReady}))
    .pipe(gulp.dest('tmp/jasmine'));
});

gulp.task('jasmine', gulp.series('clear-jasmine', 'run-jasmine'));

let port;
gulp.task('detect-jasmine', async () => {
  port = null;
  if (!await portastic.test(8888)) port = 8888;
});

gulp.task('run-spec', () => {
  const {file} = minimist(process.argv.slice(2), {string: 'file'});
  return (port
    ? gulp.src('tmp/jasmine/**/*')
    : gulp.src('spec/jasmine-test-renderer/index.js').pipe(
        webpackStream(
          {
            watch: false,
            quiet: true,
            config: test(),
          },
          webpack
        )
      ))
    .pipe(specRunner({console: true}))
    .pipe(headless({driver: 'phantomjs', file, port}))
    .pipe(
      through(
        (data, enc, next) => next(),
        flush => {
          port = null;
          flush();
        }
      )
    );
});

gulp.task('spec', gulp.series(['detect-jasmine', 'run-spec']));
