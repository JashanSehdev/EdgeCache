import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeMeta } from '../src/services/logger.js';

test('normalizeMeta turns errors into safe serializable metadata', () => {
  const err = new Error('boom');

  const result = normalizeMeta({
    error: err,
    function: 'uploadfile',
    action: 'file upload'
  });

  assert.equal(result.function, 'uploadfile');
  assert.equal(result.action, 'file upload');
  assert.equal(result.error.message, 'boom');
  assert.equal(typeof result.error.stack, 'string');
});
