#!/usr/bin/env node
import { awaken, AwakenResult } from './index.js';

const str = process.argv[2];
if (str == null) {
  console.error('Usage: links-awakening <url>');
  process.exit(1);
}
const initUrl = new URL(str);
const results = new Map<string, AwakenResult>();
let isSuccessful = true;
const onAwaken = ({ status, url, referer, msg }: AwakenResult) => {
  if (200 <= status && status <= 299) {
    console.log(`✅ ${url}`);
  } else {
    isSuccessful = false;
    console.log(`❌ ${url} (status: ${msg ?? status}, referer: ${referer})`);
  }
}
const start = Date.now();
await awaken({ url: initUrl, onAwaken, results });
const end = Date.now();
const seconds = (end - start) / 1000;
console.log(`Done! Awakened ${results.size} links in ${seconds} seconds`);

if (!isSuccessful) {
  process.exitCode = 1;
}
