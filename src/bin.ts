#!/usr/bin/env node
import { awaken, AwakenResult } from './index.js';

// @ts-ignore
const process = globalThis.process;
const str = process.argv[2];
const initUrl = new URL(str);
const results = new Map<string, AwakenResult>();
const onAwaken = ({ status, url, referer, msg }: AwakenResult) => {
  if (200 <= status && status <= 299) {
    console.log(`✅ ${url}`);
  } else {
    console.log(`❌ ${url} (status: ${msg ?? status}, referer: ${referer})`);
  }
}
const start = Date.now();
await awaken({ url: initUrl, onAwaken, results });
const end = Date.now();
const seconds = (end - start) / 1000;
console.log(`Done! Awakened ${results.size} links in ${seconds} seconds`);
process.exit(0); // TODO: should this exit with 1 if there were errors?