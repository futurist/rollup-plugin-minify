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
          // init opt for minify
          var opt = minifyMap[format];
          opt = typeof opt=='string' ? {dest: opt} : opt;
          var dest =  opt.dest;
          if(!dest) { return console.error('no dest, the minify plugin will abort for', format) }

          // prepare opt
          delete opt.dest;
          opt.fromString = true;
          var map = opt.outSourceMap = opt.outSourceMap || dest + '.map';

          var result = uglifyJs.minify(code, opt);
          // ensure the target folder exists
          mkdirp.sync(path.parse(dest).dir);
          fs.writeFileSync(dest, result.code, 'utf8');

          if(typeof map=='string') { fs.writeFileSync(map, result.map, 'utf8'); }
        }
      });
    }
  }
}

module.exports = rollup_plugin_minify;
