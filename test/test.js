const assert  = require('assert')
const { format:f } = require('util')
const { exec } = require('child_process')
const path = require('path')
const { readFileSync, unlinkSync } = require('fs')
const { rollup } = require('rollup')
const { minify } = require('uglify-js')
const lib = require('../')

const base = path.join(__dirname, './fixtures/')
process.chdir(base)

function compareFile(file, str) {
  assert.equal(readFileSync(file, 'utf8'), str)
}

function testResult(source, opt, target, done) {
  const result = minify(
    readFileSync(source, 'utf8'),
    opt
  )

  let map = opt.outSourceMap || target && target+'.map'

  if(target) {
    compareFile(target, result.code)
    let dir = path.parse(target).dir
    if(map) compareFile(target+'.map', result.map)
  }

  // clean up
  unlinkSync(source)
  if(target) {
    unlinkSync(target)
    if(map) unlinkSync(target+'.map')
  }
  done()
}

/**
 * run rollup with plugin option, and the real uglifyOption
 * @param {object} option plugin option
 * @param {object} uglifyOption the transformed uglify option
 * @param {function} done
 */
function run(option, uglifyOption, done) {
  const iife = option.iife
  const minifyDest = typeof iife=='string' ? iife : iife.dest
  const iifeDest = 'dist/iife.js'
  rollup({
    entry: entry,
    plugins: [lib(option)],
  }).then(bundle => {
    bundle.write({
      format: 'iife',
      dest: iifeDest
    }).then(() => {
      testResult(iifeDest, uglifyOption, minifyDest, done)
    }).catch(e=>done(e))
  }).catch(e=>done(e))
}

const entry = 'unminified.js'

describe('test', function () {
  this.timeout(15000)

  it('should minified with min.js', function (done) {
    run({iife: 'dist/min.js'}, {fromString:true, outSourceMap: 'min.js.map'}, done)
  })

  it('should not minified with empty options', function (done) {
    run({iife: {}}, {fromString:true, outSourceMap: ''}, done)
  })

  it('should not minified with empty string', function (done) {
    run({iife: ''}, {fromString:true, outSourceMap: ''}, done)
  })

  it('should not minified with uglify options', function (done) {
    run(
      // fromString will always set to true in plugin
      {iife: {fromString:false, dest:'min.js', sourceMapUrl:'localhost/min.js.map', warnings: true, mangle: false}},
      {fromString:true, outSourceMap: 'min.js.map', sourceMapUrl:'localhost/min.js.map', warnings: true, mangle: false},
      done
    )
  })
})
