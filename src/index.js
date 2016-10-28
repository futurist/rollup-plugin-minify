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
          // init opt for minify
          let opt = minifyMap[format]
          opt = typeof opt=='string' ? {dest: opt} : opt
          let dest =  opt.dest
          if(!dest) return console.error('no dest, the minify plugin will abort for', format)

          // prepare opt
          delete opt.dest
          opt.fromString = true
          opt.outSourceMap = opt.outSourceMap || dest + '.map'

          const result = minify(code, opt)
          // ensure the target folder exists
          mkdirp.sync(parseName(dest).dir)
          writeFileSync(dest, result.code, 'utf8')

          let sourceMapUrl = opt.sourceMapUrl || opt.outSourceMap
          if(typeof sourceMapUrl=='string') writeFileSync(sourceMapUrl, result.map, 'utf8')
        }
      })
    }
  }
}
