import test from 'node:test';import assert from 'node:assert/strict';import worker from '../worker.js';
const shell='<html><head><title>Home</title></head><body><div id="root"></div></body></html>';
const env={ASSETS:{fetch:async r=>new URL(r.url).pathname==='/nh-app-shell.html'?new Response(shell):new Response('missing',{status:404})}};
test('unknown route returns 404 with noindex',async()=>{const r=await worker.fetch(new Request('https://noteshub.tech/missing-test'),env);assert.equal(r.status,404);assert.equal(r.headers.get('X-Robots-Tag'),'noindex, follow')});
test('starter note has its own canonical',async()=>{const r=await worker.fetch(new Request('https://noteshub.tech/notes/starter-python'),env);assert.equal(r.status,200);assert.match(await r.text(),/https:\/\/noteshub.tech\/notes\/starter-python/)});
test('login route serves the app',async()=>{const r=await worker.fetch(new Request('https://noteshub.tech/login'),env);assert.equal(r.status,200)});
