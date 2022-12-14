import { check } from './index.mjs'

// node ./bin.mjs 'https://styfle.dev'
check(new URL(process.argv[2])).catch(console.error);