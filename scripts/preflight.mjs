import fs from 'node:fs';
import path from 'node:path';

// A dependency-free, source-only preflight. It is NOT a penetration test.
const root=process.cwd();
const required=[
 'src/pages/Workspace.jsx','src/pages/NotePage.jsx','src/context/AppContext.jsx',
 'src/components/UI.jsx','supabase/migrations/20261123_global_learning_security.sql',
 'public/manifest.webmanifest','public/_headers','vercel.json', '.gitignore'
];
const issues=[];
for(const name of required){if(!fs.existsSync(path.join(root,name)))issues.push(`Missing required file: ${name}`)}
const ignore=fs.readFileSync(path.join(root,'.gitignore'),'utf8');
if(!/^\.env\.local\s*$/m.test(ignore))issues.push('Add .env.local to .gitignore before committing');
const example=fs.readFileSync(path.join(root,'.env.example'),'utf8');
if(/https:\/\/[a-z0-9]{15,}\.supabase\.co/i.test(example))issues.push('Real Supabase project URL found in .env.example; restore placeholders');
if(/(?:sb_publishable_|eyJ[A-Za-z0-9_-]{40,})/.test(example))issues.push('Supabase key-like value found in .env.example; restore placeholders');
const files=['src/lib/supabase.js','src/context/AppContext.jsx','src/pages/Workspace.jsx','src/pages/NotePage.jsx','index.html','vite.config.js'];
for(const f of files){const source=fs.readFileSync(path.join(root,f),'utf8');
 if(/sb_secret_|service_role\s*[:=]\s*['"`][^'"`]+['"`]/i.test(source))issues.push(`Possible secret/service role credential in ${f}`);
}
const migration=fs.readFileSync(path.join(root,'supabase/migrations/20261123_global_learning_security.sql'),'utf8');
if(!migration.includes('drop policy if exists "Profiles visible"'))issues.push('The privacy migration does not remove the old public profile policy');
console.log('NotesHub preflight: local source configuration scan (not an external security audit)');
if(issues.length){for(const issue of issues)console.error('ERROR:',issue);process.exitCode=1}
else console.log('PASS: no obvious tracked secret patterns or missing files found.');
console.log('NEXT: run npm audit, test RLS with separate users, configure SMTP/CAPTCHA, and review public privacy policies.');