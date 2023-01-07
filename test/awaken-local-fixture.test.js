import assert from 'node:assert';
import test from 'node:test';
import { awaken } from '../dist/index.js';
import { serveLocalFixture } from './server-helper.js';

test('should awaken local fixture', async () => {
  const { server, initUrl } = await serveLocalFixture('./fixture/', 5151);
  try {
    const results = new Map();
    let count = 0;
    const onAwaken = () => {
      count++;
    };
    const start = Date.now();
    const returnValue = await awaken({ url: initUrl, onAwaken, results });
    const end = Date.now();
    const ms = (end - start);
    assert.strictEqual(returnValue, undefined);
    assert.strictEqual(count, 8);
    assert.strictEqual(results.size, 8);
    assert.ok(ms < 75, `should be quick, but took ${ms}ms`);
    assert.deepStrictEqual(Array.from(results.values()), [
      {
        referer: '',
        status: 200,
        url: 'http://127.0.0.1:5151/home.html',
      },
      {
        referer: 'http://127.0.0.1:5151/home.html',
        status: 200,
        url: 'http://127.0.0.1:5151/about.html',
      },
      {
        referer: 'http://127.0.0.1:5151/about.html',
        status: 200,
        url: 'http://127.0.0.1:5151/sub/nested.html',
      },
      {
        referer: 'http://127.0.0.1:5151/sub/nested.html',
        status: 200,
        url: 'http://127.0.0.1:5151/sub/sibling.html',
      },
      {
        referer: 'http://127.0.0.1:5151/sub/nested.html',
        status: 200,
        url: 'http://127.0.0.1:5151/sub/sibling-dot.html',
      },
      {
        referer: 'http://127.0.0.1:5151/sub/nested.html',
        status: 200,
        url: 'http://127.0.0.1:5151/relative-root.html',
      },
      {

        referer: 'http://127.0.0.1:5151/sub/nested.html',
        status: 200,
        url: 'http://127.0.0.1:5151/relative-dot-dot.html',
      },
      {
          referer: 'http://127.0.0.1:5151/sub/sibling.html',
             status: 404,
             url: 'http://127.0.0.1:5151/sub/broken-link.html'
            }
    ]);
  } finally {
    server.close();
  }
});
