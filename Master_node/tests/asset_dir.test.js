import test from 'node:test';
import assert from 'node:assert/strict';
import { asset_dir } from '../src/utils/asset_directory.js';
import fs from 'fs'
import path from 'path'

test('asset directory resolves to the shared assets folder', () => {
  assert.equal(path.basename(asset_dir), 'assets');
  assert.ok(asset_dir.endsWith(`${path.sep}src${path.sep}assets`));
});