# zuul-builder-webpack

Webpack builder for zuul test runner.

## Installation

You need to install ``zuul`` and ``zuul-builder-webpack`` packages:

    % npm install zuul zuul-builder-webpack

Zuul of version of >= 3 is supported.

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
