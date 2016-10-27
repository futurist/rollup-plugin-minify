import mkdirp from 'mkdirp'
import {parse as parseName} from 'path'
import {writeFileSync} from 'fs'
import {minify} from 'uglify-js'

export default function rollup_plugin_minify (minifyMap) {
  return {
    name: 'minify',
    transformBundle (code, option) {
      Object.keys(minifyMap).forEach(format => {
        if (option.format == format) {
          const name = minifyMap[format]
          const map = name + '.map'
          const result = minify(code, {
            fromString: true,
            outSourceMap: map
          })
          // ensure the target folder exists
          mkdirp.sync(parseName(name).dir)
          writeFileSync(name, result.code, 'utf8')
          writeFileSync(map, result.map, 'utf8')
        }
      })
    }
  }
}
