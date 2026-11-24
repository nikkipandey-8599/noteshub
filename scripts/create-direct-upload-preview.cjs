// Optional self-contained static deployment variant. Requires `typescript` dev dependency.
// This variant loads React, React Router, Supabase and icons from external ESM CDN.
// Use the normal Vite build (npm run build) for production.
const fs=require('fs'),path=require('path');
let ts;try{ts=require('typescript')}catch{ts=require('/usr/local/slides_js/node_modules/typescript')}
const source=path.resolve(__dirname,'..'), target=path.join(source,'ready-upload');
const copy=(from,to)=>{fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(from,to)};
fs.rmSync(target,{recursive:true,force:true});fs.mkdirSync(target,{recursive:true});
function walk(from,to){for(const name of fs.readdirSync(from)){const input=path.join(from,name),output=path.join(to,name);if(fs.statSync(input).isDirectory())walk(input,output);else copy(input,output)}}
walk(path.join(source,'public'),target);walk(path.join(source,'src','styles'),path.join(target,'src','styles'));
function compile(input,output){
 let code=fs.readFileSync(input,'utf8').replace(/import\s*['"]\.\/styles\/main\.css['"];?/g,'');
 if(input.endsWith('/src/lib/supabase.js'))code=code.replace(/import\.meta\.env\.VITE_SUPABASE_URL/g,"(window.NOTESHUB_CONFIG?.SUPABASE_URL||'')").replace(/import\.meta\.env\.VITE_SUPABASE_ANON_KEY/g,"(window.NOTESHUB_CONFIG?.SUPABASE_ANON_KEY||'')");
 if(input.endsWith('/src/main.jsx'))code=code.replace(/import\.meta\.env\.PROD/g,'true');
 const res=ts.transpileModule(code,{fileName:input,compilerOptions:{jsx:ts.JsxEmit.React,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext},reportDiagnostics:true});
 const diagnostics=(res.diagnostics||[]).filter(x=>x.category===ts.DiagnosticCategory.Error);if(diagnostics.length)throw new Error(input+': '+diagnostics.map(d=>ts.flattenDiagnosticMessageText(d.messageText,' ')).join(', '));
 let js=res.outputText;
 js=js.replace(/(from\s*['"])(\.\.?\/[^'"]+)(['"])/g,(_m,a,p,c)=>a+(p.endsWith('.jsx')?p.replace(/\.jsx$/,'.js'):p.endsWith('.js')?p:p+'.js')+c);
 fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,js)
}
function sources(folder){for(const filename of fs.readdirSync(folder)){const file=path.join(folder,filename);if(fs.statSync(file).isDirectory())sources(file);else if(/\.(jsx|js)$/.test(file)){const rel=path.relative(path.join(source,'src'),file).replace(/\.jsx$/,'.js');compile(file,path.join(target,'src',rel))}}}sources(path.join(source,'src'));
let html=fs.readFileSync(path.join(source,'index.html'),'utf8');
html=html.replace('<script type="module" src="/src/main.jsx"></script>', '<script type="module" src="/src/main.js"></script>');
html=html.replace('</head>',`<link rel="stylesheet" href="/src/styles/main.css"/>
<script src="/config.js"></script>
<script type="importmap">{"imports":{"react":"https://esm.sh/react@18.3.1","react-dom":"https://esm.sh/react-dom@18.3.1?external=react","react-dom/client":"https://esm.sh/react-dom@18.3.1/client?external=react","react-router-dom":"https://esm.sh/react-router-dom@6.30.1?external=react,react-dom","lucide-react":"https://esm.sh/lucide-react@0.468.0?external=react","@supabase/supabase-js":"https://esm.sh/@supabase/supabase-js@2.57.0"}}</script>
</head>`);
html=html.replace('https://example.com/', '/');
fs.writeFileSync(path.join(target,'index.html'),html);
fs.writeFileSync(path.join(target,'config.js'),`// This file contains public-only settings, never a secret or service-role key.\nwindow.NOTESHUB_CONFIG = {\n  SUPABASE_URL: '',\n  SUPABASE_ANON_KEY: ''\n};\n`);
fs.writeFileSync(path.join(target,'DEPLOY_THIS_FOLDER.txt'),`NOTESHUB DIRECT-UPLOAD PREVIEW\n\nUpload the CONTENTS of this folder to Cloudflare Pages Direct Upload.\n\nThis alternate build loads React and other libraries from esm.sh at runtime, so the site REQUIRES INTERNET to run. It is supplied for quick preview convenience; the regular Vite/npm build is better for production SEO, speed and offline PWA support.\n\nFor real user accounts and uploads, run supabase/schema.sql first and enter your PUBLIC Supabase URL and publishable key in config.js before uploading.\n\nSEO canonical metadata in this direct-upload build is not tailored to your domain. Use the Git/Vite build for production indexing.\n\nThis is a PWA, not a signed APK.\n`);
console.log('Direct-upload preview built:',target);
