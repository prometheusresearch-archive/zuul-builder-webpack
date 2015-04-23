'use strict';

var EventEmitter = require('events').EventEmitter;

var commondir = require('commondir');
var Promise = require('bluebird');
var MemoryFS = require('memory-fs');
var debug = require('debug')('zuul-builder-webpack');

var webpack = require('webpack');

function makeDeferred() {
  var resolve;
  var reject;
  var promise = new Promise(function(_resolve, _reject) {
    resolve = _resolve;
    reject = _reject;
  });
  return {
    resolve: resolve,
    reject: reject,
    promise: promise
  };
}

module.exports = function(files, config) {
  var deferred = makeDeferred();

  config = config.webpack || {};

  var compiler = webpack({
    context: commondir(files),
    entry: files,
    bail: true,
    devtool: 'source-map',
    output: {
      path: '/',
      filename: 'bundle.js'
    },
    resolve: config.resolve,
    root: config.root,
    module: config.module,
    plugins: config.plugins
  });
  compiler.outputFileSystem = new MemoryFS();

	compiler.plugin('compile', function(err) {
    deferred = makeDeferred();
  });

	compiler.plugin('done', function() {
	  debug('compilation done');
    var src = compiler.outputFileSystem.readFileSync('/bundle.js');
    var map = compiler.outputFileSystem.readFileSync('/bundle.js.map');
    deferred.resolve({
      src: src.toString(),
      map: JSON.parse(map.toString())
    });
  });

	compiler.plugin('failed', function(err) {
	  debug('compilation failed');
	  // for some reason we should touch the stack before passing it to bluebird,
	  // otherwise we got an error
	  err.stack;
    deferred.reject(err);
  });

	compiler.plugin('invalid', function() {
	  debug('bundle invalidated');
    deferred = makeDeferred();
  });

  debug('initialisation complete');
	compiler.watch(200, function(err, stats) {

  });

  return function build(cb) {
    deferred.promise.then(
      function(result) {
        cb(null, result.src, result.map);
      },
      function(err) {
        cb(err);
      });
  };
};
