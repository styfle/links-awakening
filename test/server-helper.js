import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
/**
 *
 * @param {string} fixture
 */
export async function serveLocalFixture(fixture, port) {
  const initUrl = new URL(`http://127.0.0.1:${port}/home.html`);
  const fixtureBase = new URL(fixture, import.meta.url);
  const server = createServer(async ({ url }, res) => {
    const relativeUrl = url.startsWith('/') ? `.${url}` : url;
    const filePath = new URL(relativeUrl, fixtureBase);
    const fileContents = await readFile(filePath).catch(() => null);
    if (!fileContents) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      return res.end('<h1>Not Found</h1>');
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fileContents);
  }).listen(initUrl.port, initUrl.hostname);
  return { server, initUrl };
}
