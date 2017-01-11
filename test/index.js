const {join} = require('path');
const {existsSync} = require('fs');
const co = require('bluebird').coroutine;
const test = require('tape');
const Fly = require('fly');

const dir1 = join(__dirname, 'tmp1');
const dir2 = join(__dirname, 'tmp2');

const fly = new Fly({
	plugins: [{
		func: require('../')
	}],
	tasks: {
		* a(o) {
			const {t, src} = o.val;
			t.true('clear' in fly, 'attach `clear` to fly global');
			// t.true('clear' in f, 'attach `clear` to fly context');
			yield this.clear(src);
		}
	}
});

const exists = file => existsSync(file);
const create = file => fly.$.write(file);

test('fly-clear: filepath (task)', co(function * (t) {
	t.plan(2);
	const src = `${dir1}/foo`;
	yield create(src);
	yield fly.start('a', {val: {t, src}});
	t.false(exists(src), 'file was deleted');
}));

test('fly-clear: filepath', co(function * (t) {
	t.plan(1);
	const src = `${dir1}/foo`;
	yield create(src);
	yield fly.clear(src);
	t.false(exists(src), 'file was deleted');
}));

test('fly-clear: directory', co(function * (t) {
	t.plan(1);
	const src = `${dir1}/foo`;
	yield create(src);
	yield fly.clear(dir1);
	t.false(exists(src), 'directory was deleted');
}));

test('fly-clear: filepath array', co(function * (t) {
	t.plan(2);
	const src1 = `${dir1}/foo`;
	const src2 = `${dir1}/bar`;
	yield create(src1);
	yield create(src2);
	yield fly.clear([src1, src2]);
	t.false(exists(src1), 'file1 was deleted');
	t.false(exists(src2), 'file2 was deleted');
}));

test('fly-clear: directory array', co(function * (t) {
	t.plan(2);
	const src1 = `${dir1}/foo`;
	const src2 = `${dir2}/bar`;
	yield create(src1);
	yield create(src2);
	yield fly.clear([dir1, dir2]);
	t.false(exists(src1), 'dir1 was deleted');
	t.false(exists(src2), 'dir2 was deleted');
}));

test('fly-clear: directory glob', co(function * (t) {
	t.plan(4);
	const src1 = `${dir1}/foo`;
	const src2 = `${dir2}/bar/baz`;
	const src3 = `${dir2}/bar/bat`;
	yield create(src1);
	yield create(src2);
	yield create(src3);
	yield fly.clear([dir1, `${dir2}/bar/*`]);
	t.false(exists(src1), 'dir1 was deleted');
	t.false(exists(src2), 'dir2/file1 was deleted');
	t.false(exists(src3), 'dir2/file2 was deleted');
	t.true(exists(`${dir2}/bar`), 'dir2/bar still exists');
	yield fly.clear(dir2);
}));

test('fly-clear: with `rimraf` options', co(function * (t) {
	t.plan(2);
	const src1 = `${dir1}/bar/baz`;
	const src2 = `${dir1}/bar/bat`;
	yield create(src1);
	yield create(src2);
	yield fly.clear(`${dir1}/bar/*`, {glob: false});
	t.true(exists(src1), 'file1 still exists');
	t.true(exists(src2), 'file2 still exists');
	yield fly.clear(dir1);
}));
