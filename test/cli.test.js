import assert from 'node:assert';
import childProcess from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { serveLocalFixture } from './server-helper.js';

const execFile = promisify(childProcess.execFile);
const bin = fileURLToPath(new URL('../dist/bin.js', import.meta.url));

test('should return exit code 0 on success', async () => {
  const initUrl = 'https://example.vercel.sh';
  const result = await execFile('node', [bin, initUrl], { timeout: 5000 }).catch(err => err)
  assert.ok(!(result instanceof Error), 'did not expect an error');
  assert.match(result.stdout, /✅.+example\.vercel\.sh/);
  assert.match(result.stdout, /✅.+examples\.vercel\.live/);
  assert.match(result.stdout, /Done! Awakened 2 links in .+ seconds/);
});

test('should return exit code 1 on failure', async () => {
  const { server, initUrl } = await serveLocalFixture('./fixture/', 5252);
  const result = await execFile('node', [bin, initUrl], { timeout: 5000 }).catch(err => err);
  try {
    assert.ok(result instanceof Error, 'expected an error');
    assert.deepStrictEqual(result.code, 1);
    assert.match(result.stdout, /✅.+home\.html/);
    assert.match(result.stdout, /❌.+broken-link\.html/);
    assert.match(result.stdout, /Done! Awakened 8 links in .+ seconds/);
  } finally {
    server.close();
  }
});
