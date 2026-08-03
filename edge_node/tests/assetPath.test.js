import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { assetDir, asset_dir } from '../src/utlils/assetPath.js';

test('asset directory resolves to the shared assets folder', () => {
  assert.equal(path.basename(assetDir), 'assets');
  assert.equal(assetDir, asset_dir);
  assert.ok(assetDir.endsWith(`${path.sep}src${path.sep}assets`));
});
