import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { delete_asset_entry } from '../src/utlils/database.utils.js';
import { add_entry, get_entry_by_filename, delete_asset_by_filename } from '../src/database/db.js';
import { asset_dir } from '../src/utlils/assetPath.js';

test('delete_asset_entry removes metadata for an existing asset', async () => {
  const filename = 'test-delete-asset.txt';
  const filePath = path.join(asset_dir, filename);

  fs.writeFileSync(filePath, 'hello world');
  await add_entry(filename, 11, 'text/plain');

  try {
    await delete_asset_entry(filename);

    const entry = await get_entry_by_filename(filename);
    assert.equal(entry, undefined);
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await delete_asset_by_filename(filename);
  }
});
