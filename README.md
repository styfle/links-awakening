# Links Awakening

Recursively check a website for broken links.

## Usage

```sh
npx links-awakening 'https://styfle.dev'
```

Output

```
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