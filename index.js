'use strict';

const toArr = require('arrify');
const Promise = require('bluebird');
const del = Promise.promisify(require('rimraf'));

module.exports = function (fly) {
	fly.plugin('clear', {every: 0, files: 0}, function * (_, globs, opts) {
		opts = opts || {};
		yield Promise.all(toArr(globs).map(g => del(g, opts)));
	});
};
