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
          var name = minifyMap[format];
          var map = name + '.map';
          var result = minify(code, {
            fromString: true,
            outSourceMap: map
          });
          // ensure the target folder exists
          mkdirp.sync(parse(name).dir);
          writeFileSync(name, result.code, 'utf8');
          writeFileSync(map, result.map, 'utf8');
        }
      });
    }
  }
}

export default rollup_plugin_minify;
