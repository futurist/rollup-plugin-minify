const assert  = require('assert')
const path  = require('path')
const lib = require('../')
const { format:f } = require('util')
const { exec } = require('child_process')
const { join } = require('path')
const { mkdir, readFileSync, writeFileSync } = require('fs')
const { rollup } = require('rollup')
const { minify } = require('uglify-js')

const uglifyBin = join(__dirname, '../node_modules/.bin/uglifyjs')
const base = join(__dirname, './fixtures/')
process.chdir(base)

function compareFile(file1, file2) {
  assert.equal(readFileSync(file1, 'utf8'), readFileSync(file2, 'utf8'))
}

function testResult(file, out, target, done) {
  var outPath = path.parse(out)
  mkdir(outPath.dir, err=>err)
  // uglify first
  exec(f(
    `node %s %s -c -m -o %s --source-map %s --source-map-root %s`,
    uglifyBin,
    file,
    out,
    outPath.base+'.map',
    outPath.dir
  ), {cwd: base}, err => {
    if(err) done(err)
    compareFile(out, target)
    compareFile(out+'.map', target+'.map')
    done()
  })
}

const entry = 'unminified.js'

describe('test', function () {
  this.timeout(15000)
  it('should minified with min.js', done => {
    return rollup({
      entry: entry,
      plugins: [lib({iife: 'min.js'})],
    }).then(bundle => {
      bundle.generate({
        format: 'iife',
        useStrict: false
      })
      testResult(entry, 'out/min.js', 'min.js', done)
    })

  })
})
