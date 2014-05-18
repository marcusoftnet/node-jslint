// this file is lib/lintstream.js
// provides a stream interface to JSLint
//
// Copyright 2014 Cubane Canada Inc.
//
// Released under modified MIT/BSD 3-clause license
// See LICENSE for details.

/*jslint unparam: true*/

(function () {
    'use strict';

    var util = require('util'),
        Transform = require('readable-stream').Transform,
        nodelint = require('./nodelint'),
        linter = require('./linter'),
        LintStream;

    LintStream = function LintStream_constructor(options) {
        if (!(this instanceof LintStream)) {
            return new LintStream(options);
        }
        Transform.call(this, {objectMode: true});

        // shallow copy options
        options = linter.merge({}, options);
        this.JSlint = nodelint.load(options.edition);

        // initialize members
        this.options = options;
        this.linter = linter;
    };
    util.inherits(LintStream, Transform);

    function LintStream_transform(chunk, encoding, callback) {
        var fileName = chunk.file,
            body = chunk.body,
            linted = this.linter.doLint(this.JSlint, body, this.options);

        this.push({file: fileName, linted: linted});

        callback();
    }

    /*jslint nomen: true */
    LintStream.prototype._transform = LintStream_transform;

    module.exports = LintStream;

}());