// Small, dependency-free PDF writer for the original starter revision sheets.
const ascii=s=>String(s).replace(/[^\x20-\x7e]/g,' ');
const esc=s=>ascii(s).replace(/[\\()]/g,'\\$&');
function wrap(s,max=78){const rows=[];let line='';for(const w of ascii(s).split(/\s+/)){if(line&&line.length+w.length+1>max){rows.push(line);line=''}line+=(line?' ':'')+w}if(line)rows.push(line);return rows}
export function makeStudyPdf(subject,item){
 const lines=[];let y=750;
 const text=(s,size=11,bold=false,color='0.18 0.17 0.22')=>{lines.push('BT /'+(bold?'F2':'F1')+' '+size+' Tf '+color+' rg 48 '+y+' Td ('+esc(s)+') Tj ET');y-=size+6};
 const para=s=>{for(const l of wrap(s))text(l);y-=12};
 const heading=s=>{text(s,15,true,'0.36 0.25 0.60');y-=3};
 text('NOTESHUB / STUDY SERIES',11,true,'0.36 0.25 0.60');y-=12;
 text(subject,15,true);for(const l of wrap(item.title,38))text(l,23,true);y-=16;
 heading('Core concept');para(item.explanation);
 heading('Worked example');para(item.example);para(item.analysis);
 heading('Quick self-check');para(item.question);heading('Answer and revision');para(item.answer);
 if(y<65)throw Error('Study sheet exceeds page layout');
 lines.push('0.84 0.81 0.90 RG 48 54 m 547 54 l S');
 lines.push('BT /F1 10 Tf 0.36 0.32 0.42 rg 48 36 Td (NotesHub | Original introductory revision sheet | noteshub.tech) Tj ET');
 const stream=lines.join('\n')+'\n';
 const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>','<< /Length '+stream.length+' >>\nstream\n'+stream+'endstream'];
 let out='%PDF-1.4\n',offsets=[0];objects.forEach((o,i)=>{offsets.push(out.length);out+=(i+1)+' 0 obj\n'+o+'\nendobj\n'});const x=out.length;out+='xref\n0 '+offsets.length+'\n0000000000 65535 f \n'+offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')+'trailer\n<< /Size '+offsets.length+' /Root 1 0 R >>\nstartxref\n'+x+'\n%%EOF\n';return new Blob([out],{type:'application/pdf'});
}
