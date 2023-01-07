import { Parser } from 'htmlparser2';

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
        if (/https?:/.test(href)) {
          // Set depth=0 to avoid crawling external URLs
          promises.push(
            awaken({
              onAwaken,
              results,
              url: new URL(href),
              referer: url,
              depth: 0,
            }),
          );
        } else {
          // assume relative URL so decrement depth and crawl
          promises.push(
            awaken({
              onAwaken,
              results,
              url: new URL(href, url),
              referer: url,
              depth: depth - 1,
            }),
          );
        }
      }
    },
  });
  const html = await res.text();
  parser.write(html);
  parser.end();
  await Promise.all(promises);
}
