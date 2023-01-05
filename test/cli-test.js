import assert from 'node:assert';
import test from 'node:test';
import childProcess from 'node:child_process';

test('cli example', () => {
  try {
    childProcess.execSync('node ./dist/bin.js https://example.vercel.sh');
  } catch {
    assert.fail('All links should be reachable.');
  }
});
