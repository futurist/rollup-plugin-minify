const assert  = require('assert')
const { format:f } = require('util')
const { exec } = require('child_process')
const { join } = require('path')
const { readFileSync, unlinkSync } = require('fs')
const { rollup } = require('rollup')
const { minify } = require('uglify-js')
const lib = require('../')

const base = join(__dirname, './fixtures/')
process.chdir(base)

function compareFile(file, str) {
  assert.equal(readFileSync(file, 'utf8'), str)
}

function testResult(source, target, done) {
  var result = minify(
    readFileSync(source, 'utf8'),
    {
      fromString:true,
      outSourceMap: target+'.map'
    }
  )
  compareFile(target, result.code)
  compareFile(target+'.map', result.map)
  unlinkSync(source)
  unlinkSync(target)
  unlinkSync(target+'.map')
  done()
}

const entry = 'unminified.js'

describe('test', function () {
  this.timeout(15000)
  it('should minified with min.js', function (done) {
    rollup({
      entry: entry,
      plugins: [lib({iife: 'min.js'})],
    }).then(function(bundle) {
      bundle.write({
        format: 'iife',
        dest: 'iife.js'
      }).then(function() {
        testResult('iife.js', 'min.js', done)
      })
    })
  })
})
