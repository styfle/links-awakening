import test from 'node:test';
import assert from 'node:assert';
import child_process from 'node:child_process';

test('cli example', () => {
  try {
    child_process.execSync('node ./dist/bin.js https://example.vercel.sh');
  } catch {
    assert.fail('All links should be reachable.');
  }
});
