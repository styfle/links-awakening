import fetch from 'node-fetch'
import { load } from 'cheerio'

export async function check(url = new URL('http://example.com'), referer, seen = new Set(), depth = 10) {
  url.hash = ''; // since hash is client-side only, we remove it in order to avoid duplicate requests
  if (seen.has(url.href)) {
    return;
  }
  seen.add(url.href);
  const res = await fetch(url, { headers: { 'user-agent': 'npm:links-awakening' } }).catch(e => e);
  if (res.ok) {
    console.log(`✅ ${url.href}`);
  } else if (res.status) {
    console.log(`❌ ${url.href} (status: ${res.status}, referer: ${referer})`);
    return;
  } else {
    console.log(`❌ ${url.href} (error: ${res}, referer: ${referer})`);
    return;
  }
  if (depth === 0) {
    return;
  }
  const html = await res.text();
  const $ = load(html);
  const hrefs = $('a[href]').map((_, el) => el.attribs.href).get();
  for (const href of hrefs) {
    if (/https?:/.test(href)) {
      // We don't want to crawl external urls so we set depth to 0
      await check(new URL(href), url, seen, 0);
    } else {
      await check(new URL(href, url), url, seen, depth - 1);
    }
  }
}
