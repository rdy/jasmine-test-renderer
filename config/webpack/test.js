import JasminePlugin from 'gulp-jasmine-browser/webpack/jasmine-plugin';
import NamedModulesPlugin from 'webpack/lib/NamedModulesPlugin';
import NoEmitOnErrorsPlugin from 'webpack/lib/NoEmitOnErrorsPlugin';
import babelOptions from '../babel/test.json';
import {modulePath} from './helper';
import {resolve} from 'path';

export default function() {
  return {
    devtool: 'source-map',
    entry: {
      spec: ['babel-polyfill', 'babel-core/register', './spec/jasmine-test-renderer/index.js']
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: ['src', 'spec'].map(modulePath),
          use: {
            loader: 'babel-loader',
            options: babelOptions
          },
        }
      ]
    },
    output: {filename: 'spec.js'},
    plugins: [
      new JasminePlugin(),
      new NamedModulesPlugin(),
      new NoEmitOnErrorsPlugin()
    ]
  };
}