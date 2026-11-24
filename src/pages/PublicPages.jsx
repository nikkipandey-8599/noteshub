import React,{useMemo,useState}from'react';import{Link,useNavigate,useParams,useSearchParams}from'react-router-dom';
import{ArrowDownToLine,ArrowRight,BookMarked,BookOpen,Bookmark,ChevronDown,ChevronRight,CloudUpload,Compass,Download,Eye,FileText,Filter,GraduationCap,Heart,Layers3,Leaf,Lock,Menu,MessageCircle,Network,Plus,Search,Share2,ShieldCheck,SlidersHorizontal,Smartphone,Sparkles,Star,Upload,Users,X}from'lucide-react';
import{useApp}from'../context/AppContext';import{features,faqs,subjects,starterNotes,colors}from'../data/content';
import{slugify}from'../lib/supabase';import{Empty,NoteCard,Pill,Button}from'../components/UI';
// The six starter subjects are examples; new subjects appear automatically after approval.
function listSubjects(notes){
 const map=new Map(subjects.map(s=>[s.name.toLocaleLowerCase(),{...s,count:0}]));
 for(const n of notes){
  if(n.status!=='approved'||!n.subject?.trim())continue;
  const key=n.subject.trim().toLocaleLowerCase();
  if(!map.has(key))map.set(key,{name:n.subject.trim(),slug:slugify(n.subject)||encodeURIComponent(n.subject.trim()),color:colors[map.size%colors.length],blurb:'Community learning notes on '+n.subject.trim()+'.',count:0});
  map.get(key).count++;
 }
 return [...map.values()].sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name));
}
export function Home(){const{notes}=useApp(),[faqOpen,setFaqOpen]=useState(0),[term,setTerm]=useState('');const nav=useNavigate();const published=notes.filter(n=>n.status==='approved'),featuredSubjects=listSubjects(published).slice(0,6);
 return <>
 <div className="hero-wrap"><div className="hero container"><div className="hero-copy"><div className="eyebrow-bubble"><span className="bubble-spark">✳</span> The coziest corner of your study life <span className="bubble-arrow">↗</span></div><h1>Big ideas.<br/><em>Little notes.</em><br/>Better together<span className="hero-period">.</span></h1><p>Your notes deserve a better home. Find what you need, save what clicks, and share the pages that helped you get there.</p><form className="hero-search" onSubmit={e=>{e.preventDefault();nav(`/explore?q=${encodeURIComponent(term)}`)}}><Search size={21}/><input value={term} onChange={e=>setTerm(e.target.value)} placeholder="Try 'Computer Networks'..." aria-label="Search study notes"/><button aria-label="Find notes"><ArrowRight size={21}/></button></form><div className="hero-cta"><Link to="/explore" className="btn btn-primary">Explore the library <ArrowRight size={18}/></Link><Link to="/upload" className="btn btn-outline">Share your notes <CloudUpload size={18}/></Link></div><div className="hero-trust"><span className="round-flower">✺</span><span>Free learning resources • PDF previews • Student-powered</span></div></div>
 <div className="hero-visual" aria-label="Illustration of overlapping pastel study note cards"><div className="hero-squiggle">✳</div><div className="hero-note hero-note-back"><div className="paper-line short"/><div className="paper-line"/><div className="paper-line"/><div className="paper-line half"/></div><div className="hero-note hero-note-mid"><span className="hero-pin">✦</span><span className="micro-label">LITTLE REMINDERS</span><div className="hero-doodle">✳</div><h3>One good note<br/>changes everything.</h3><span className="hero-note-foot">Keep going, you've got this!</span></div><div className="hero-note hero-note-front"><span className="tag-top">STUDY NOTES / 001</span><span className="hero-checkbox">✓</span><h3>You've got<br/>this, superstar!</h3><div className="hero-handline">a little progress every day ↗</div><div className="paper-bottom">♡ &nbsp; save • share • shine</div></div><div className="floating-star star-one">✳</div><div className="floating-star star-two">✦</div><div className="floating-sticker">made for your a-ha moments <span>↗</span></div></div></div></div>
 <div className="marquee-strip"><div>YOUR NEXT A-HA MOMENT ✳ YOUR NEW FAVOURITE STUDY SPOT ✳ MADE FOR CURIOUS MINDS ✳ YOUR NEXT A-HA MOMENT ✳ YOUR NEW FAVOURITE STUDY SPOT ✳ MADE FOR CURIOUS MINDS ✳</div></div>
 <section className="section container" id="library"><div className="section-top"><div><span className="kicker">✦ A LITTLE SOMETHING FOR EVERY SUBJECT</span><h2>Find your next <i>favorite</i> note.</h2><p>Explore original sample guides and approved community notes for every learning level.</p></div><Link to="/explore" className="text-link">Browse all notes <ArrowRight size={18}/></Link></div><div className="notes-grid">{published.slice(0,6).map((n,i)=><NoteCard key={n.id} note={n} index={i}/>)}</div></section>
 <section className="section section-subjects"><div className="container"><div className="section-top"><div><span className="kicker">ORGANIZED, NOT OVERWHELMING</span><h2>What are we <i>learning?</i></h2><p>Anything from school maths to coding, languages, art or independent study.</p></div><Link className="text-link" to="/subjects">View subjects <ArrowRight size={18}/></Link></div><div className="subject-grid">{featuredSubjects.map((s,i)=><Link to={`/subjects/${s.slug}`} key={s.slug} className={`subject-tile subject-${s.color}`}><span className="subject-index">0{i+1}</span><div className="subject-ornament">{['✳','✺','⌘','❋','✦','◈'][i]}</div><h3>{s.name}</h3><span>Explore resources <ArrowRight size={15}/></span></Link>)}</div></div></section>
 <section className="section container" id="features"><div className="section-top center"><div><span className="kicker">SMALL DETAILS, BIG DIFFERENCE</span><h2>Designed to make <i>studying</i> feel lighter.</h2><p>No chaos, no endless searching. Just the good stuff.</p></div></div><div className="feature-grid">{features.map((f,i)=>{const Icon=[GraduationCap,Eye,Bookmark,ShieldCheck,Sparkles,Smartphone][i];return <div key={f.title} className="feature-card"><span className={`feature-illustration feature-${i}`}><Icon size={26}/></span><h3>{f.title}</h3><p>{f.text}</p></div>})}</div></section>
 <section className="story-section"><div className="container story-grid"><div className="story-art"><div className="story-card story-one"><span>today's little win</span><h3>One note<br/>at a time.</h3><b>✳</b></div><div className="story-card story-two"><span>❋ a friendly reminder</span><h3>Your best work<br/>is still ahead.</h3><div>♡ ♡ ♡</div></div></div><div className="story-text"><span className="kicker">A NOTE FROM US</span><h2>Knowledge grows<br/>when it's <i>shared.</i></h2><p>That one explanation you wrote before an exam? It might be exactly what someone else needed. NotesHub gives student-created learning resources a thoughtful place to live.</p><p>Share what you own, explore what others have shared, and build a kinder study community together.</p><Link className="btn btn-primary" to="/upload">Contribute a note <ArrowRight size={18}/></Link></div></div></section>
 <section className="section container faq-section"><div><span className="kicker">THE LITTLE DETAILS</span><h2>Good questions.<br/><i>Clear answers.</i></h2><p>Everything you need to know before diving in.</p><Link to="/about" className="text-link">More about us <ArrowRight size={17}/></Link></div><div className="faq-list">{faqs.slice(0,5).map((f,i)=><div key={f.q} className="faq-item"><button onClick={()=>setFaqOpen(faqOpen===i?-1:i)} aria-expanded={faqOpen===i}><span>{f.q}</span><span className="faq-plus">{faqOpen===i?'−':'+'}</span></button>{faqOpen===i&&<p>{f.a}</p>}</div>)}</div></section>
 <section className="closing-cta"><div className="container"><span>✳ THE BEST PART? IT'S FREE.</span><h2>Let's make space<br/>for <i>your next idea.</i></h2><p>Your next favorite note could be one click away.</p><div className="closing-buttons"><Link className="btn btn-dark" to="/explore">Explore notes <ArrowRight size={18}/></Link><Link className="btn btn-white" to="/install">Get the app <Smartphone size={17}/></Link></div></div><span className="cta-doodle">✺</span></section>
 </>}
export function Explore({subjectFilter}){
 const{notes,loading}=useApp();
 const[params,setParams]=useSearchParams();
 const q=params.get('q')||'';
 const selected=subjectFilter||params.get('subject')||'all';
 const course=params.get('course')||'all';
 const level=params.get('level')||params.get('semester')||'all';
 const sort=params.get('sort')||'newest';
 const type=params.get('type')||'all';
 const published=notes.filter(n=>n.status==='approved');
 const options=(field)=>[...new Set(published.map(n=>(n[field]||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
 const setParam=(key,v)=>{const updated=new URLSearchParams(params);if(v==='all'||!v)updated.delete(key);else updated.set(key,v);if(key==='level')updated.delete('semester');setParams(updated)};
 const filtered=useMemo(()=>published.filter(n=>{
  const haystack=[n.title,n.description,n.subject,n.course,n.semester,n.college,...(n.tags||[])].join(' ').toLocaleLowerCase();
  return (!q||haystack.includes(q.toLocaleLowerCase()))
   &&(selected==='all'||n.subject.toLocaleLowerCase()===selected.toLocaleLowerCase())
   &&(course==='all'||n.course===course)
   &&(level==='all'||n.semester===level)
   &&(type==='all'||(type==='samples'?n.is_starter:!n.is_starter));
 }).sort((a,b)=>sort==='popular'?(b.downloads||0)-(a.downloads||0):sort==='title'?a.title.localeCompare(b.title):new Date(b.created_at)-new Date(a.created_at)),[notes,q,selected,course,level,type,sort]);
 return <div className="container listing-page">
  <div className="listing-hero"><div><span className="kicker">YOUR OPEN LEARNING LIBRARY</span><h1>Let's find <i>your notes.</i></h1><p>Any subject. Any grade or learning path. Free original PDFs and moderated community uploads.</p></div><div className="listing-mark">✳</div></div>
  <div className="filter-panel">
   <div className="filter-search"><Search size={19}/><input value={q} onChange={e=>setParam('q',e.target.value)} placeholder="Search any subject, class, course or topic..." aria-label="Search notes"/></div>
   <div className="filter-fields">
    <label>Subject<select value={selected} onChange={e=>setParam('subject',e.target.value)}><option value="all">All subjects</option>{options('subject').map(s=><option key={s}>{s}</option>)}</select></label>
    <label>Course or path<select value={course} onChange={e=>setParam('course',e.target.value)}><option value="all">Any course</option>{options('course').map(s=><option key={s}>{s}</option>)}</select></label>
    <label>Learning level<select value={level} onChange={e=>setParam('level',e.target.value)}><option value="all">All levels</option>{options('semester').map(s=><option key={s}>{s}</option>)}</select></label>
    <label>Source<select value={type} onChange={e=>setParam('type',e.target.value)}><option value="all">All notes</option><option value="community">Community uploads</option><option value="samples">Sample notes</option></select></label>
    <label>Sort by<select value={sort} onChange={e=>setParam('sort',e.target.value)}><option value="newest">Newest first</option><option value="popular">Most downloaded</option><option value="title">A to Z</option></select></label>
   </div>
  </div>
  <div className="results-head"><div><strong>{filtered.length}</strong> {filtered.length===1?'resource':'resources'} to explore</div>{(q||selected!=='all'||course!=='all'||level!=='all'||type!=='all')&&<button className="clear-link" onClick={()=>setParams({})}>Clear filters <X size={15}/></button>}</div>
  {loading?<p className="state-note">Loading the library...</p>:filtered.length?<div className="notes-grid">{filtered.map((n,i)=><NoteCard note={n} key={n.id} index={i}/>)}</div>:<Empty icon={Search} title="No notes here just yet" text="Try different keywords, or request a new resource for this subject." action={<Link to="/requests" className="btn btn-outline">Request a note <ArrowRight size={16}/></Link>}/>}
  <div className="bottom-note">✳ Know something worth sharing? <Link to="/upload">Add your notes to the library.</Link></div>
 </div>
}
export function Subjects(){
 const{notes}=useApp(),items=listSubjects(notes);
 return <div className="container basic-page"><div className="page-banner"><span className="kicker">A SUBJECT FOR EVERY CURIOSITY</span><h1>Every subject has <i>a story.</i></h1><p>These categories grow automatically as people upload approved notes. Uploads can use any subject name.</p></div>
 <div className="subject-grid large">{items.map((s,i)=><Link key={s.name} className={`subject-tile subject-${s.color}`} to={`/subjects/${s.slug}`}><span className="subject-index">{s.count} {s.count===1?'resource':'resources'}</span><div className="subject-ornament">{['✳','✺','⌘','❋','✦','◈'][i%6]}</div><h3>{s.name}</h3><p>{s.blurb||'Explore learning resources contributed by the community.'}</p><span>Explore notes <ArrowRight size={17}/></span></Link>)}</div></div>
}
export function SubjectDetail(){
 const{slug}=useParams(),{notes}=useApp(),subject=listSubjects(notes).find(s=>s.slug===slug);
 if(!subject)return <NotFound/>;
 return <><div className={`subject-landing subject-${subject.color}`}><div className="container"><Link to="/subjects" className="text-link">← All subjects</Link><span className="kicker">OPEN STUDY SHELF</span><h1>{subject.name}<span>✳</span></h1><p>{subject.blurb||'Free shared PDFs and community notes for this topic.'}</p><Link className="btn btn-dark" to={`/explore?subject=${encodeURIComponent(subject.name)}`}>Browse {subject.name} notes <ArrowRight size={18}/></Link></div></div><div className="container subject-guide"><h2>Make your next study session easier.</h2><p>Start with a sample or approved note, read actively, and test what you learned in your own words.</p><Explore subjectFilter={subject.name}/></div></>
}
export function NotFound(){return <div className="container not-found"><h1>Oops, wrong notebook. ✳</h1><p>That page does not exist or may have moved.</p><Link to="/" className="btn btn-primary">Back to the good stuff <ArrowRight size={16}/></Link></div>}