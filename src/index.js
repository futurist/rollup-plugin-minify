import mkdirp from 'mkdirp'
import path from 'path'
import { writeFileSync } from 'fs'
import { minify } from 'uglify-js'

export default function rollup_plugin_minify (minifyMap) {
  return {
    name: 'minify',
    transformBundle(code, option) {
      Object.keys(minifyMap).forEach(format => {
        if (option.format == format) {
          // init opt for minify
          let opt = minifyMap[format]
          opt = typeof opt == 'string' ? {dest: opt} : opt
          let dest = opt.dest
          if (!dest) return console.error('no dest, the minify plugin will abort for', format)
          const destObj = path.parse(dest)

          // prepare opt
          delete opt.dest
          opt.fromString = true
          const map = opt.outSourceMap = opt.outSourceMap || destObj.base + '.map'

          const result = minify(code, opt)
          // ensure the target folder exists
          mkdirp.sync(destObj.dir)
          writeFileSync(dest, result.code, 'utf8')

          if (map) writeFileSync(path.join(destObj.dir, map), result.map, 'utf8')
        }
      })
    }
  }
}
