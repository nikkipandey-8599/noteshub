import assert from 'node:assert/strict';
const origin='https://noteshub.tech';
async function get(path,status){const r=await fetch(origin+path,{redirect:'manual'});assert.equal(r.status,status,path);return r}
const home=await get('/',200);const html=await home.text();assert.match(html,/<title>[^<]+<\/title>/i);assert.match(html,/rel="canonical" href="https:\/\/noteshub.tech\//);assert.match(html,/manifest\.webmanifest/);assert.match(html,/name="description"/);assert.equal(home.headers.get('x-content-type-options'),'nosniff');
const missing=await get('/__noteshub_audit_missing_7e6d',404);assert.match(missing.headers.get('x-robots-tag')||await missing.text(),/noindex/i);
const sitemap=await (await get('/sitemap.xml',200)).text();assert.match(sitemap,/<urlset/);assert.match(sitemap,/<loc>https:\/\/noteshub.tech\//);assert.ok(!sitemap.includes('workers.dev'));
await get('/robots.txt',200);const manifest=await (await get('/manifest.webmanifest',200)).json();assert.ok(manifest.icons?.length);await get('/sw.js',200);console.log('Live HTTP smoke checks passed');
