<p align="center">
  <a href="https://github.com/styfle/links-awakening">
    <img alt="Photo of Link waking up" src="https://styfle.dev/images/projects/links-awakening.jpg" width="320" height="160" />

  </a>
</p>
<h3 align="center">Links Awakening</h3>
<p align="center">Recursively check a website for broken links.</p>

## Usage

```sh
npx links-awakening 'https://styfle.dev'
```

Output

```sh
✅ https://styfle.dev/
✅ https://styfle.dev/projects
✅ https://styfle.dev/blog
✅ https://styfle.dev/contact
✅ https://twitter.com/styfle
✅ https://keybase.io/styfle
✅ https://github.com/styfle
✅ https://www.npmjs.com/~styfle
✅ https://styfle.dev/blog/copee-released
✅ http://googlechromereleases.blogspot.com/
✅ https://developers.google.com/web/updates/
✅ https://developers.google.com/web/updates/2015/04/cut-and-copy-commands
❌ http://zeroclipboard.org/ (status: 500, referer: https://styfle.dev/blog/copee-released)
✅ http://styfle.github.io/copee/
✅ https://styfle.dev/blog/d3js-graph-prod
❌ https://styfle.dev/slides/d3js.html (status: 404, referer: https://styfle.dev/blog/d3js-graph-prod)
```

### Programmatic API

```ts
import { awaken, type AwakenResult } from 'links-awakening';

const onAwaken = ({ url, status }: AwakenResult) => {
  const icon = status >= 200 && status <= 299 ? '✅' : '❌';
  console.log(`${icon} ${url}`);
};

const url = new URL('https://example.com/blog');

const results = new Map<string, AwakenResult>();

await awaken({ url, onAwaken, results });

console.log(`Done! Crawled ${results.size} links.`);
```
