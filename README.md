# rollup-plugin-minify
Rollup plugin to minify generated format into new minified file, with source maps, using [uglify-js](https://github.com/mishoo/UglifyJS2).

[![CircleCI](https://circleci.com/gh/futurist/rollup-plugin-minify.svg?style=svg)](https://circleci.com/gh/futurist/rollup-plugin-minify)

## Install

``` bash
npm install rollup-plugin-minify
```

## Usage

``` javascript
import { rollup } from 'rollup'
import minify from 'rollup-plugin-minify'

rollup({
    entry: 'src.js',
    plugins: [
        minify({iife: 'iife.min.js', cjs: 'cjs.min.js'})
    ]
})
```

This will generate minified `"iife.min.js"` file with `iife` format, so and `cjs`.

You can pass [uglify-js options](https://github.com/mishoo/UglifyJS2#api-reference), as below:

``` javascript
    plugins: [
        minify({ iife: {
          dest: 'iife.min.js',
          mangle: false,
          sourceMapUrl: 'localhost/out.js.map'
        }})
    ]
```

## License

MIT

