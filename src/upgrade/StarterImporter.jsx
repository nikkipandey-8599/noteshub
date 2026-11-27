import React,{useState,useRef} from 'react';
import {useApp} from '../context/AppContext';
import {studyPack} from '../data/studyPack';
import {makeStudyPdf} from '../lib/studyPdf';
const entries=studyPack.flatMap(g=>g.items.map(item=>({...item,subject:g.subject,slug:g.slug})));
export default function StarterImporter(){
 const a=useApp(),[busy,setBusy]=useState(false),[results,setResults]=useState({}),[consent,setConsent]=useState(false);
 const lock=useRef(false);
 async function run(){
  if(lock.current||!consent||!a.isAdmin||!a.user)return;
  lock.current=true;setBusy(true);
  const uid=a.user.id;
  try{
   for(const item of entries){
    const set=(status)=>setResults(old=>({...old,[item.id]:status}));
    try{
     const {data:session,error:sessionError}=await a.supabase.auth.getUser();
     if(sessionError||session.user?.id!==uid)throw Error('Account changed; sign in again.');
     const {data:admin,error:adminError}=await a.supabase.rpc('is_admin');
     if(adminError||admin!==true)throw Error('Admin access required.');
     const path=uid+'/nh-study-v1-'+item.id+'.pdf';
     const {data:existing,error:lookup}=await a.supabase.from('notes').select('id,status').eq('file_path',path).maybeSingle();
     if(lookup)throw lookup;
     if(existing){set('Already imported ('+existing.status+')');continue}
     set('Uploading');
     const blob=makeStudyPdf(item.subject,item);
     const bucket=a.supabase.storage.from('note-pdfs');
     const {error:upload}=await bucket.upload(path,blob,{contentType:'application/pdf',upsert:false});
     if(upload){
      // A previous interrupted attempt may have uploaded the deterministic file.
      const {data:old,error:read}=await bucket.download(path);
      if(read||!old||await old.text()!==await blob.text())throw upload;
     }
     const {error:insert}=await a.supabase.from('notes').insert({owner_id:uid,owner_name:'NotesHub contributor',title:item.subject+' - '+item.title,description:item.explanation+' Includes a worked example and self-check with answer.',subject:item.subject,course:'Computer Science / IT',semester:'Any level',college:'',tags:[item.slug,'revision','fundamentals'],color:'lavender',file_path:path,file_size:blob.size,status:'pending'});
     if(insert){const {data:created}=await a.supabase.from('notes').select('id').eq('file_path',path).maybeSingle();if(!created)throw insert}
     set('Submitted for review');
    }catch(e){set('Failed: '+(e.message||'Unknown error'))}
   }
   await a.reload();
  }finally{lock.current=false;setBusy(false)}
 }
 if(!a.isAdmin)return null;
 const completed=Object.values(results).filter(x=>x.startsWith('Submitted')||x.startsWith('Already')).length;
 return <section className="nh-panel"><h2>Import starter study library</h2><p>50 original one-page introductory revision sheets across 10 IT subjects. Preview a sheet before importing; new notes remain pending until approved.</p><button type="button" className="btn btn-outline" onClick={()=>{const first=entries[0];const url=URL.createObjectURL(makeStudyPdf(first.subject,first));const link=document.createElement('a');link.href=url;link.download='noteshub-preview.pdf';link.click();setTimeout(()=>URL.revokeObjectURL(url),60000)}}>Preview sample PDF</button><label className="fp-check"><input type="checkbox" checked={consent} disabled={busy} onChange={e=>setConsent(e.target.checked)}/><span>I will review these original study sheets before publishing them.</span></label><button type="button" className="btn btn-primary" disabled={busy||!consent} onClick={run}>{busy?'Importing…':completed?'Retry / check import':'Import 50 study sheets'}</button><p role="status">{completed} / {entries.length} imported or already present. Keep this page open during import.</p><progress max={entries.length} value={completed}/><details><summary>Resources and import results</summary>{studyPack.map(g=><div key={g.slug}><h3>{g.subject}</h3>{g.items.map(item=><p key={item.id}>{item.title} — {results[item.id]||'Not imported'}</p>)}</div>)}</details></section>
}
