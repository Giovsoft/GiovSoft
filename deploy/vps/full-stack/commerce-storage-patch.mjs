import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const original = `async function read() {
  try { return { ...structuredClone(empty), ...JSON.parse(await fs.readFile(dataFile, "utf8")) }; }
  catch { await write(empty); return structuredClone(empty); }
}
async function write(value) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(value, null, 2));
}`;
const replacement = `// VPS storage guard: a failed read must never erase production data.
async function read() {
  return { ...structuredClone(empty), ...JSON.parse(await fs.readFile(dataFile, "utf8")) };
}
async function write(value) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  const temporary = dataFile + "." + crypto.randomUUID() + ".tmp";
  try {
    const handle = await fs.open(temporary, "wx", 0o600);
    try {
      await handle.writeFile(JSON.stringify(value, null, 2));
      await handle.sync();
    } finally { await handle.close(); }
    await fs.rename(temporary, dataFile);
  } finally { await fs.rm(temporary, { force: true }); }
}`;
export function patchCommerceStorage(source) {
  if (source.includes(replacement)) return source;
  if (source.split(original).length !== 2) throw new Error('Unexpected Commerce storage implementation; refusing patch');
  return source.replace(original,replacement);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [input,output] = process.argv.slice(2);
  if (!input || !output || input === output) throw new Error('Usage: commerce-storage-patch.mjs original.js patched.js');
  await fs.writeFile(output,patchCommerceStorage(await fs.readFile(input,'utf8')),{mode:0o600});
  console.log('COMMERCE_STORAGE_PATCH_READY');
}
