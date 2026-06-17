import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Load the compiled CommonJS handler produced in `dist/vercel.js`.
const handler = require('./dist/vercel.js');

// Export ESM-friendly default and config that Vercel expects.
export default handler;
export const config = {};
