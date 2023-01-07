import assert from 'node:assert';
import test from 'node:test';
import { awaken } from '../dist/index.js';

test('should awaken absolute url example.vercel.sh', async () => {
  const initUrl = new URL('https://example.vercel.sh');
  const results = new Map();
  let count = 0;
  const onAwaken = () => {
    count++;
  };
  const start = Date.now();
  const returnValue = await awaken({ url: initUrl, onAwaken, results });
  const end = Date.now();
  const seconds = (end - start) / 1000;
  assert.strictEqual(returnValue, undefined);
  assert.strictEqual(count, 2);
  assert.strictEqual(results.size, 2);
  assert.ok(seconds < 1, `should be less than 1 seconds, but took ${seconds}`);
  assert.deepStrictEqual(Array.from(results.values()), [
    { url: 'https://example.vercel.sh/', status: 200, referer: '' },
    {
      url: 'https://examples.vercel.live/',
      status: 200,
      referer: 'https://example.vercel.sh/',
    },
  ]);
});
