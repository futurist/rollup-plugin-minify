import mkdirp from 'mkdirp';
import { parse } from 'path';
import { writeFileSync } from 'fs';
import { minify } from 'uglify-js';

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
          opt.outSourceMap = opt.outSourceMap || dest + '.map';

          var result = minify(code, opt);
          // ensure the target folder exists
          mkdirp.sync(parse(dest).dir);
          writeFileSync(dest, result.code, 'utf8');

          var sourceMapUrl = opt.sourceMapUrl || opt.outSourceMap;
          if(typeof sourceMapUrl=='string') { writeFileSync(sourceMapUrl, result.map, 'utf8'); }
        }
      });
    }
  }
}

export default rollup_plugin_minify;
