'use strict;'

var fs = require('fs');
var glob = require('glob');
var browserify  = require('browserify');
var mkdirp = require("mkdirp");

mkdirp.sync("./temp");
var outfile = fs.createWriteStream('./temp/browser-test-bundle.js', { encoding: 'utf-8', flags: 'w'})

browserify({
    entries: glob.sync('./dist/test/**/*.js'),
    extensions: ['.js', '.json'],
    debug: true
})
.require('tzdata/timezone-data.json', {expose: 'tzdata'})
.bundle()
.pipe(outfile);
