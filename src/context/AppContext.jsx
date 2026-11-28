import {readStorage,writeStorage} from '../lib/safeStorage';
import {normalized,validatePdf} from '../lib/library';
import React,{createContext,useCallback,useContext,useEffect,useMemo,useRef,useState} from 'react';
import{configured,supabase,MAX_PDF_BYTES,slugify}from'../lib/supabase';
import{starterNotes}from'../data/content';
const Context=createContext(null);
const initialBookmarks=()=>{try{return JSON.parse(localStorage.getItem('noteshub-bookmarks')||'[]')}catch{return []}};
const initialRecent=()=>{try{return JSON.parse(localStorage.getItem('noteshub-recent')||'[]')}catch{return []}};
export const useApp=()=>useContext(Context);
export function AppProvider({children}){
 const[localBookmarks,setLocalBookmarks]=useState(initialBookmarks);
 const[recentIds,setRecentIds]=useState(initialRecent);
 const recordViewed=useCallback(id=>{setRecentIds(old=>[id,...old.filter(x=>x!==id)].slice(0,12))},[]);
 const[theme,setTheme]=useState(()=>readStorage('noteshub-theme','light')==='dark'?'dark':'light');
 const[authReady,setAuthReady]=useState(!configured),[adminReady,setAdminReady]=useState(!configured),[session,setSession]=useState(null),[profile,setProfile]=useState(null),[isAdmin,setIsAdmin]=useState(false);
 const[notes,setNotes]=useState(starterNotes),[bookmarks,setBookmarks]=useState(initialBookmarks),[collections,setCollections]=useState([]),[requests,setRequests]=useState([]);
 const[loading,setLoading]=useState(configured),[toast,setToast]=useState(null);
 const userId=session?.user?.id;
 const accountRef=useRef(null), reloadRef=useRef(0);
 const applySession=next=>{const id=next?.user?.id||null;if(accountRef.current!==id){accountRef.current=id;reloadRef.current++;setAdminReady(!id);setProfile(null);setIsAdmin(false);setCollections([]);setBookmarks(old=>old.filter(x=>String(x).startsWith('starter-')));setNotes(old=>old.filter(n=>n.status==='approved'||n.is_starter));}setSession(next);setAuthReady(true)};
 const notify=(message,type='info')=>setToast({message,type,id:Date.now()});
 const clearToast=()=>setToast(null);
 useEffect(()=>{document.documentElement.dataset.theme=theme;writeStorage('noteshub-theme',theme)},[theme]);
 useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(null),4400);return()=>clearTimeout(timer)},[toast]);
 useEffect(()=>{if(!configured)return;let active=true,received=false;supabase.auth.getSession().then(({data})=>{if(active&&!received)applySession(data.session)});const{data:{subscription}}=supabase.auth.onAuthStateChange((_event,next)=>{if(active){received=true;applySession(next)}});return()=>{active=false;subscription.unsubscribe()}},[]);
 const reload=useCallback(async()=>{
  if(!configured){setLoading(false);return}
  const sequence=++reloadRef.current;
  try{
   const pageAll=async make=>{const rows=[];for(let offset=0;;offset+=500){const r=await make().range(offset,offset+499);if(r.error)throw r.error;rows.push(...r.data);if(r.data.length<500)return {data:rows}}};
   const [result,ratings,requestResult]=await Promise.all([
    pageAll(()=>supabase.from('notes').select('*').order('created_at',{ascending:false}).order('id')),
    pageAll(()=>supabase.from('ratings').select('note_id,value').order('note_id').order('created_at')),
    supabase.from('note_requests').select('id,subject,details,author_name,created_at').order('created_at',{ascending:false}).limit(60)
   ]);
   if(sequence!==reloadRef.current)return;
   if(result.error)throw result.error;
   const totals={};for(const r of ratings.data||[]){const t=totals[r.note_id]||(totals[r.note_id]={sum:0,count:0});t.sum+=r.value;t.count++}
   setNotes([...(result.data||[]).map(n=>({...n,rating_count:totals[n.id]?.count||0,rating_average:totals[n.id]?(totals[n.id].sum/totals[n.id].count):0})),...starterNotes]);
   if(!requestResult.error)setRequests(requestResult.data||[]);
  }catch(error){if(sequence===reloadRef.current)notify('Could not refresh notes: '+error.message,'error')}
  finally{if(sequence===reloadRef.current)setLoading(false)}
 },[]);
 useEffect(()=>{reload()},[reload,userId]);

 useEffect(()=>{
  if(!configured||!userId){setProfile(null);setIsAdmin(false);setCollections([]);if(configured)setBookmarks(localBookmarks.filter(id=>String(id).startsWith('starter-')));return}
  let cancelled=false;
  (async()=>{
   const[pr,ad,bm,co,rq]=await Promise.all([
    supabase.from('profiles').select('*').eq('id',userId).maybeSingle(),
    supabase.rpc('is_admin'),
    supabase.from('bookmarks').select('note_id').eq('user_id',userId),
    supabase.from('collections').select('*,collection_items(note_id)').eq('user_id',userId).order('created_at',{ascending:false}),
    supabase.from('note_requests').select('id,subject,details,author_name,created_at').order('created_at',{ascending:false}).limit(60)
   ]);
   if(cancelled||accountRef.current!==userId)return;
   setProfile(pr.data||null);setIsAdmin(!ad.error&&ad.data===true);setAdminReady(true);
   setBookmarks([...new Set([...(bm.data||[]).map(b=>b.note_id),...localBookmarks.filter(id=>String(id).startsWith('starter-'))])]);setCollections(co.data||[]);setRequests(rq.data||[]);
   if(pr.error)console.warn('Profile load:',pr.error.message)
  })();return()=>{cancelled=true}
 },[userId]);
 useEffect(()=>{writeStorage('noteshub-bookmarks',JSON.stringify(localBookmarks))},[localBookmarks]);
 useEffect(()=>{writeStorage('noteshub-recent',JSON.stringify(recentIds))},[recentIds]);
 useEffect(()=>{if(configured)setBookmarks(old=>[...new Set([...old.filter(id=>!String(id).startsWith('starter-')),...localBookmarks.filter(id=>String(id).startsWith('starter-'))])])},[configured,localBookmarks]);
 const requireAccount=()=>{if(!configured){notify('Connect Supabase to enable real accounts and community uploads.','warning');return false}if(!userId){notify('Sign in to use this feature.','warning');return false}return true};
 const toggleBookmark=async noteId=>{
  if(!configured||String(noteId).startsWith('starter-')){setBookmarks(old=>old.includes(noteId)?old.filter(id=>id!==noteId):[...old,noteId]);setLocalBookmarks(old=>old.includes(noteId)?old.filter(id=>id!==noteId):[...old,noteId]);notify('Your starter note bookmark was updated');return}
  if(!requireAccount())return;
  const saved=bookmarks.includes(noteId);
  const result=saved?await supabase.from('bookmarks').delete().eq('user_id',userId).eq('note_id',noteId):await supabase.from('bookmarks').insert({user_id:userId,note_id:noteId});
  if(accountRef.current!==userId)return;
  if(result.error){notify(result.error.message,'error');return}
  setBookmarks(old=>saved?old.filter(id=>id!==noteId):[...old,noteId]);notify(saved?'Removed from saved notes':'Added to your deck','success');
 };
 const uploadNote=async({file,deferRefresh=false,...metadata})=>{
  if(!requireAccount())throw Error('Sign in to upload notes');
  await validatePdf(file,MAX_PDF_BYTES);
  if(metadata.title.trim().length<5||metadata.description.trim().length<10||normalized(metadata.subject).length<2)throw Error('Enter a valid title, description and subject.');
  const path=`${userId}/${crypto.randomUUID()}-${slugify(file.name.replace(/\.pdf$/i,''))}.pdf`;
  const{error:uploadError}=await supabase.storage.from('note-pdfs').upload(path,file,{contentType:'application/pdf',cacheControl:'3600',upsert:false});
  if(uploadError)throw uploadError;
  const payload={title:metadata.title.trim(),description:metadata.description.trim(),subject:normalized(metadata.subject),course:normalized(metadata.course)||'General learning',semester:normalized(metadata.semester)||'Any level',college:metadata.college?.trim()||'',tags:metadata.tags||[],file_path:path,file_size:file.size,owner_id:userId,owner_name:'NotesHub contributor',color:metadata.color||'lavender',status:'pending'};
  const{error}=await supabase.from('notes').insert(payload);if(error){await supabase.storage.from('note-pdfs').remove([path]);throw error}
  if(!deferRefresh)await reload();notify('PDF submitted! An admin will review it before publication.','success');
 };
 const editNote=async(id,data)=>{
  if(!requireAccount())return;
  const{error}=await supabase.from('notes').update({title:data.title,description:data.description,subject:normalized(data.subject),course:normalized(data.course)||'General learning',semester:normalized(data.semester)||'Any level',college:data.college?.trim()||'',tags:data.tags,color:data.color}).eq('id',id);
  if(error)throw error;await reload();notify('Changes saved; note returned to review queue.','success');
 };
 const deleteNote=async(note)=>{
  if(!configured||!userId||note.is_starter||(!isAdmin&&note.owner_id!==userId))throw Error('You cannot delete this note.');
  const {data,error}=await supabase.from('notes').delete().eq('id',note.id).select('id').maybeSingle();
  if(error)throw error;if(!data)throw Error('Note could not be deleted. Check your permissions.');
  const {error:storageError}=await supabase.storage.from('note-pdfs').remove([note.file_path]);
  setNotes(old=>old.filter(n=>n.id!==note.id));setBookmarks(old=>old.filter(id=>id!==note.id));setRecentIds(old=>old.filter(id=>id!==note.id));
  await reload();notify(storageError?'Note removed from library; PDF storage cleanup needs administrator attention.':'Note deleted.','success');
 };
 const getPdfUrl=async(note)=>{
  if(note.is_starter)return note.file_path;
  if(!configured)throw Error('Live PDFs require a Supabase connection');
  const{data,error}=await supabase.storage.from('note-pdfs').createSignedUrl(note.file_path,120);
  if(error)throw error;return data.signedUrl;
 };
 const recordDownload=async(note)=>{if(note.is_starter||!configured||!userId||note.status!=='approved')return;const {error}=await supabase.rpc('increment_note_download',{target_id:note.id});if(error)console.warn('Download counter:',error.message);else if(accountRef.current===userId){const {data}=await supabase.from('notes').select('downloads').eq('id',note.id).maybeSingle();if(data&&accountRef.current===userId)setNotes(old=>old.map(n=>n.id===note.id?{...n,downloads:data.downloads}:n))}};
 const submitRating=async(noteId,rating)=>{
  if(!requireAccount())throw Error('Sign in to rate notes');
  const{error}=await supabase.from('ratings').upsert({note_id:noteId,user_id:userId,value:rating},{onConflict:'note_id,user_id'});
  if(error)throw error;await reload();notify('Rating saved. Thank you!','success');
 };
 const submitReport=async(noteId,reason)=>{
  if(!requireAccount())throw Error('Sign in to report a note');
  const{error}=await supabase.from('reports').insert({note_id:noteId,reporter_id:userId,reason});if(error)throw error;
  notify('Report sent to moderators. Thank you.','success');
 };
 const saveProfile=async(updates)=>{
  if(!requireAccount())return;const{error}=await supabase.from('profiles').update(updates).eq('id',userId);if(error)throw error;
  if(accountRef.current!==userId)return;setProfile(old=>({...old,...updates}));notify('Profile updated.','success');
 };
 const createCollection=async(name)=>{
  if(!requireAccount())throw Error('Sign in first');
  const{error}=await supabase.from('collections').insert({user_id:userId,name:name.trim()});if(error)throw error;await refreshCollections();notify('Collection created!','success');
 };
 const refreshCollections=async()=>{if(!userId)return;const{data}=await supabase.from('collections').select('*,collection_items(note_id)').eq('user_id',userId).order('created_at',{ascending:false});if(accountRef.current===userId)setCollections(data||[])};
 const toggleCollectionNote=async(collectionId,noteId)=>{
  if(!requireAccount())return;
  const found=collections.find(c=>c.id===collectionId)?.collection_items?.some(i=>i.note_id===noteId);
  const{error}=found?await supabase.from('collection_items').delete().eq('collection_id',collectionId).eq('note_id',noteId):await supabase.from('collection_items').insert({collection_id:collectionId,note_id:noteId});
  if(error)throw error;await refreshCollections();notify(found?'Removed from collection':'Added to collection','success');
 };
 const createRequest=async({subject,details})=>{
  if(!requireAccount())throw Error('Sign in first');
  const{error}=await supabase.from('note_requests').insert({user_id:userId,author_name:'Learner',subject,details});if(error)throw error;
  const{data}=await supabase.from('note_requests').select('id,subject,details,author_name,created_at').order('created_at',{ascending:false}).limit(60);setRequests(data||[]);notify('Note request posted!','success');
 };
 const moderate=async(id,status)=>{
  if(!isAdmin)throw Error('Admin access required');const{error}=await supabase.from('notes').update({status}).eq('id',id);if(error)throw error;
  await reload();notify('Note '+status+'.','success');
 };
 const resolveReport=async(id)=>{if(!isAdmin)throw Error('Admin access required');const{error}=await supabase.from('reports').update({resolved:true}).eq('id',id);if(error)throw error;notify('Report resolved','success')};
 const value=useMemo(()=>({authReady,adminReady,configured,supabase,theme,setTheme,session,user:session?.user,profile,isAdmin,notes,bookmarks,recentIds,recordViewed,collections,requests,loading,toast,notify,clearToast,reload,requireAccount,toggleBookmark,uploadNote,editNote,deleteNote,getPdfUrl,recordDownload,submitRating,submitReport,saveProfile,createCollection,toggleCollectionNote,createRequest,moderate,resolveReport}),[authReady,adminReady,theme,session,profile,isAdmin,notes,bookmarks,recentIds,recordViewed,collections,requests,loading,toast]);
 return <Context.Provider value={value}>{children}</Context.Provider>
}