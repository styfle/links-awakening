#!/usr/bin/env node
import type { AwakenResult } from './index.js';
import { awaken } from './index.js';

const str = process.argv[2];
if (!str) {
  console.error('Usage: links-awakening <url>');
  process.exit(1);
}
const initUrl = new URL(str);
const results = new Map<string, AwakenResult>();
let isSuccessful = true;
const onAwaken = ({ status, url, referer, msg }: AwakenResult): void => {
  if (status >= 200 && status <= 299) {
    console.log(`✅ ${url}`);
  } else {
    isSuccessful = false;
    console.log(`❌ ${url} (status: ${msg ?? status}, referer: ${referer})`);
  }
};
const start = Date.now();
await awaken({ url: initUrl, onAwaken, results });
const end = Date.now();
const seconds = (end - start) / 1000;
console.log(`Done! Awakened ${results.size} links in ${seconds} seconds`);

process.exit(isSuccessful ? 0 : 1);
