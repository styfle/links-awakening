import { Parser } from 'htmlparser2';
import fetch from 'node-fetch';

export interface AwakenResult {
  url: string;
  referer: string;
  status: number;
  msg?: string;
}

export interface AwakenProps {
  url: URL;
  onAwaken: (result: AwakenResult) => void;
  results?: Map<string, AwakenResult>;
  referer?: string;
  depth?: number;
  timeout?: number;
  userAgent?: string;
}

const normalizeUrl = (url: URL): string => {
  // since hash is client-side only, we must
  // remove it in order to avoid duplicate requests
  url.hash = '';
  return url.href;
};

export async function awaken({
  url: rawUrl,
  onAwaken,
  results = new Map(),
  referer = '',
  depth = 10,
  timeout = 5000,
  userAgent = 'npm:links-awakening',
}: AwakenProps): Promise<void> {
  if (rawUrl.protocol !== 'http:' && rawUrl.protocol !== 'https:') {
    return; // cannot crawl non-http(s) urls so stop recursion
  }
  const url = normalizeUrl(rawUrl);
  if (results.has(url)) {
    return; // already crawled this url so stop recursion
  }
  const result: AwakenResult = {
    url,
    referer,
    status: 999,
  };
  results.set(url, result);
  const res = await fetch(url, {
    signal: AbortSignal.timeout(timeout),
    headers: { 'user-agent': userAgent, referer },
  }).catch((e: Error) => e);
  if (res instanceof Error) {
    if (res.cause instanceof Error) {
      result.msg = res.cause.message;
    } else {
      result.msg = res.message;
    }
  } else {
    result.status = res.status;
  }
  onAwaken(result);
  if (res instanceof Error || !res.ok || depth === 0) {
    return; // error or we reached max depth so stop recursion
  }
  const promises: Promise<void>[] = [];
  const parser = new Parser({
    onopentag(name, { href }): void {
      if (name === 'a' && href) {
        let absoluteUrl: URL;
        let newDepth = 0;
        try {
          absoluteUrl = new URL(href);
          // absolute/external href so set depth=0 to stop crawling deeper
          newDepth = 0;
        } catch {
          absoluteUrl = new URL(href, url);
          // relative/internal href so decrement depth and continue crawling
          newDepth = depth - 1;
        }
        promises.push(
          awaken({
            onAwaken,
            results,
            url: absoluteUrl,
            referer: url,
            depth: newDepth,
          }),
        );
      }
    },
  });
  const html = await res.text();
  parser.write(html);
  parser.end();
  await Promise.all(promises);
}
