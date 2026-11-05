import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
let patch = x => x;
try { ({patchCommerceStorage: patch} = await import('./commerce-storage-patch.mjs')); }
catch (e) { if (e.code !== 'ERR_MODULE_NOT_FOUND') throw e; }
const legacy = `async function read() {
  try { return { ...structuredClone(empty), ...JSON.parse(await fs.readFile(dataFile, "utf8")) }; }
  catch { await write(empty); return structuredClone(empty); }
}
async function write(value) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(value, null, 2));
}`;
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
async function fixture(t) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(),'commerce-storage-'));
  t.after(()=>fs.rm(dir,{recursive:true,force:true}));
  const file = path.join(dir,'commerce.json');
  const api = await new AsyncFunction('fs','path','crypto','dataFile','empty',patch(legacy)+'; return {read,write};')(fs,path,crypto,file,{stores:[],products:[],orders:[]});
  return {file,...api};
}
test('a malformed data file raises an error without overwriting recoverable bytes',async t=>{
  const f=await fixture(t); await fs.writeFile(f.file,'{"orders":[incomplete');
  await assert.rejects(f.read());
  assert.equal(await fs.readFile(f.file,'utf8'),'{"orders":[incomplete');
});
test('missing production data never silently creates an empty store',async t=>{
  const f=await fixture(t); await assert.rejects(f.read(),{code:'ENOENT'});
  await assert.rejects(fs.stat(f.file),{code:'ENOENT'});
});
test('concurrent readers never observe a partially written catalogue',async t=>{
  const f=await fixture(t);const state={stores:[{id:'school'}],products:Array.from({length:1000},(_,id)=>({id,name:'producto'.repeat(30)})),orders:[{id:'preserved'}]};
  await f.write(state);
  await Promise.all([...(Array.from({length:15},()=>f.write(state))),...(Array.from({length:50},async()=>{const d=await f.read();assert.equal(d.products.length,1000);assert.equal(d.orders[0].id,'preserved');}))]);
  assert.deepEqual(await f.read(),state);
});
