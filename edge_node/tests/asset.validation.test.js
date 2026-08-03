import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import file_validation from '../src/services/asset.validation.js';
import { add_entry, delete_asset_by_filename } from '../src/database/db.js';
import { assetDir } from '../src/utlils/assetPath.js';

test('file_validation returns false for a missing file', async () => {
  const result = await file_validation('missing-file.pdf');

  assert.equal(result.isFileValid, false);
  assert.equal(result.filepath, path.join(assetDir, 'missing-file.pdf'));
});

test('file_validation returns true for an existing cached file', async () => {
  const filename = 'cached-file.pdf';
  const filePath = path.join(assetDir, filename);

  fs.writeFileSync(filePath, 'hello');
  await add_entry(filename, 5, 'application/pdf');

  try {
    const result = await file_validation(filename);
    assert.equal(result.isFileValid, true);
    assert.equal(result.filepath, filePath);
  } finally {
    fs.unlinkSync(filePath);
    await delete_asset_by_filename(filename);
  }
});
