# zuul-builder-webpack

Webpack builder for zuul test runner.

## Installation

This plugin for zuul only works against a fork of zuul (PR is pending to be
merged to upstream soon) with allows to configure zuul through js code which is
vital for webpack configuration:

  % npm install andreypopp/zuul#js-config
  % npm install prometheusresearch/zuul-webpack-builder

## Usage

Create the following ``zuul.config.js``:

    module.exports = {
      builder: 'zuul-builder-webpack',
      webpack: {
        // webpack config goes here
        // you can also just do require('./webpack.config')
        // to reference your webpack configuration
      }
    };

Run zuul:

    % zuul ...
