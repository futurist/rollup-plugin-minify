'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var mkdirp = _interopDefault(require('mkdirp'));
var path = require('path');
var fs = require('fs');
var uglifyJs = require('uglify-js');

function rollup_plugin_minify (minifyMap) {
  return {
    name: 'minify',
    transformBundle: function transformBundle (code, option) {
      Object.keys(minifyMap).forEach(function (format) {
        if (option.format == format) {
          var name = minifyMap[format];
          var map = name + '.map';
          var result = uglifyJs.minify(code, {
            fromString: true,
            outSourceMap: map
          });
          // ensure the target folder exists
          mkdirp.sync(path.parse(name).dir);
          fs.writeFileSync(name, result.code, 'utf8');
          fs.writeFileSync(map, result.map, 'utf8');
        }
      });
    }
  }
}

module.exports = rollup_plugin_minify;
