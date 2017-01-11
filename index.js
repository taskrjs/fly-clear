'use strict';

const arrify = require('arrify');
const bluebird = require('bluebird');
const rimraf = require('rimraf');

module.exports = function () {
	// const del = fly.$.promisify(rimraf);
	const del = bluebird.promisify(rimraf);

	this.plugin('clear', {every: 0, files: 0}, function * (_, globs, opts) {
		opts = opts || {};
		globs = arrify(globs);
		yield bluebird.all(globs.map(g => del(g, opts)));
	});
};
