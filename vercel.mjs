// Dynamically import the compiled CommonJS handler at runtime. Using dynamic
// `import()` avoids bundling the CommonJS source into the ESM wrapper which
// can introduce `module.exports` in an ESM context.
const loaded = await import('./dist/vercel.js');
const handler = loaded?.default ?? loaded;

export default handler;
export const config = {};
