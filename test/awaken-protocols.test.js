import assert from 'node:assert';
import test from 'node:test';
import { awaken } from '../dist/index.js';
import { serveLocalFixture } from './server-helper.js';

test('should awaken protocols fixture', async () => {
  const { server, initUrl } = await serveLocalFixture(
    './fixture-protocols/',
    5353,
  );
  try {
    const results = new Map();
    let count = 0;
    const onAwaken = () => {
      count++;
    };
    const start = Date.now();
    const returnValue = await awaken({ url: initUrl, onAwaken, results });
    const end = Date.now();
    const ms = end - start;
    assert.strictEqual(returnValue, undefined);
    assert.strictEqual(count, 1);
    assert.strictEqual(results.size, 1);
    assert.ok(
      ms < (process.env.CI ? 200 : 75),
      `should be quick, but took ${ms}ms`,
    );
    assert.deepStrictEqual(Array.from(results.values()), [
      {
        referer: '',
        status: 200,
        url: 'http://127.0.0.1:5353/home.html',
      },
    ]);
  } finally {
    server.close();
  }
});
