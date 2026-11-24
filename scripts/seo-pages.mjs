import fs from 'node:fs';import path from 'node:path';
const dir=path.resolve('dist'), url=(process.env.VITE_SITE_URL||process.env.CF_PAGES_URL||'https://example.com').replace(/\/$/,'');
let html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
html=html.replaceAll('https://example.com',url);fs.writeFileSync(path.join(dir,'index.html'),html);
const pages=[
 ['/', 'Free Notes & Study PDFs for Any Subject | NotesHub', 'Browse original PDF sample guides and approved community notes for school, college, skills and independent learning.', 'Your next helpful note is here. Search free PDFs and approved community resources for any learning level.'],
 ['/explore','Browse Free Study Notes & PDFs | NotesHub','Discover free PDFs by subject, course, learning level, and keywords. Preview and download approved notes.','Search learning PDFs, filter by subject and learning level, and save helpful revision guides.'],
 ['/subjects','Browse Subjects and Learning Notes | NotesHub','Find free subject notes from school to university, career learning and independent study.','Discover subjects and free original learning PDFs.'],
 ['/guides','Study Guides and Revision Techniques | NotesHub','Learn how to study with PDFs, organize revision materials and share original student notes responsibly.','Read the three-pass PDF method, revision organization tips and responsible note sharing.'],
 ['/about','About NotesHub — Student Notes Community','Discover NotesHub, a student-focused learning library for free, responsibly shared study resources.','Our student-first mission: free, thoughtfully shared notes and revision guides.'],
 ['/install','Install NotesHub PWA on Android, iOS and Desktop','Install the NotesHub learning notes Progressive Web App on a compatible device from your browser.','Add NotesHub to your home screen for an app-like study library.'],
 ['/subjects/data-structures','Data Structures Notes PDF | NotesHub','Free data structures notes PDF with algorithms, complexity, stacks, queues, linked lists and exam revision.', 'Understand stacks, queues, linked lists, sorting and asymptotic analysis.'],
 ['/subjects/database-management','DBMS & SQL Notes PDF | NotesHub','Free DBMS and SQL notes PDF: keys, normalization, SQL queries and relational database concepts.', 'Revise SQL, primary and foreign keys, and normalization.'],
 ['/subjects/computer-networks','Computer Networks Notes PDF | NotesHub','Free Computer Networks PDF notes on OSI layers, TCP/IP, addressing and protocols.', 'Study the OSI model and TCP/IP with short revision notes.'],
 ['/subjects/python-programming','Python Programming Notes PDF | NotesHub','Free Python programming notes for beginners: variables, control flow, loops, functions, collections and examples.', 'Learn Python functions, loops, lists, dictionaries and fundamentals.'],
 ['/subjects/web-development','Web Development Notes: HTML CSS JavaScript | NotesHub','Free HTML, CSS and JavaScript notes PDF: semantic HTML, CSS layout, responsive design and DOM basics.', 'Review core web development concepts with free PDF notes.'],
 ['/subjects/operating-systems','Operating Systems Notes PDF | NotesHub','Free Operating Systems notes PDF: processes, CPU scheduling, deadlocks, memory and filesystems.', 'Study CPU scheduling, process management, memory and deadlocks.']
];
const escape=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
for(const [route,title,description,summary] of pages){
 let content=html.replace(/<title>[^<]*<\/title>/,`<title>${escape(title)}</title>`).replace(/<meta name="description" content="[^"]*"\/>/,`<meta name="description" content="${escape(description)}"/>`).replace(/<meta property="og:title" content="[^"]*"\/>/,`<meta property="og:title" content="${escape(title)}"/>`);
 content=content.replace('</head>',`<link rel="canonical" href="${url+route}"/></head>`);
 // Static crawlable fallback replaced by React after JS loads; useful for crawlers with JS disabled.
 content=content.replace('<div id="root"></div>',`<div id="root"><main style="font:16px system-ui;margin:5rem auto;max-width:900px;padding:2rem"><h1>${escape(title)}</h1><p>${escape(summary)}</p><p><a href="/explore">Browse free notes</a> | <a href="/subjects">Browse subjects</a></p></main></div>`);
 const target=path.join(dir,route.slice(1),'index.html');fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,content);
}
fs.writeFileSync(path.join(dir,'robots.txt'),`User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /profile\nDisallow: /library\nDisallow: /admin\nDisallow: /upload\nDisallow: /login\nSitemap: ${url}/sitemap.xml\n`);
fs.writeFileSync(path.join(dir,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(([route])=>`<url><loc>${url+route}</loc><changefreq>weekly</changefreq></url>`).join('\n')}\n</urlset>`);
console.log(`SEO: created ${pages.length} crawlable page shells and sitemap for ${url}`);