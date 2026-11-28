import{AnalyticsSettings}from'../upgrade/UpgradePages';
import React,{useEffect,useRef,useState}from'react';import{Link,useLocation,useNavigate}from'react-router-dom';
import{ArrowRight,BookMarked,BookOpen,Bookmark,Check,ChevronDown,ChevronLeft,CloudUpload,Download,FileText,FolderHeart,Info,LayoutDashboard,Menu,Moon,Search,ShieldCheck,Smartphone,Sun,Upload,UserRound,LogOut,X}from'lucide-react';
import{useApp}from'../context/AppContext';
import InstallBanner from './InstallBanner';
import {usePWAInstall} from '../hooks/usePWAInstall';
export function Logo({small=false}){return <Link to="/" className={'logo '+(small?'small':'')} aria-label="NotesHub home"><img src="/icons/icon-192.png" alt=""/><span>Notes<span className="logo-accent">Hub</span><i>.</i></span></Link>}
export function Button({children,variant='primary',className='',...props}){return <button className={`btn btn-${variant} ${className}`} {...props}>{children}</button>}
export function Pill({children,color='lavender',className=''}){return <span className={`pill pill-${color} ${className}`}>{children}</span>}
export function Empty({icon:Icon=FileText,title='Nothing here yet',text,action}){return <div className="empty"><div className="empty-icon"><Icon size={27}/></div><h3>{title}</h3><p>{text||'Try a different search or explore another category.'}</p>{action}</div>}
export function Layout({children}){
 const{theme,setTheme,session,configured,toast,clearToast,isAdmin,supabase,notify}=useApp();const[mobile,setMobile]=useState(false);const[accountOpen,setAccountOpen]=useState(false);const accountRef=useRef(null);const{canInstall,install}=usePWAInstall();
 const loc=useLocation(),nav=useNavigate();const[query,setQuery]=useState('');
 useEffect(()=>{setMobile(false);setAccountOpen(false);window.scrollTo({top:0,behavior:'auto'})},[loc.pathname]);
 useEffect(()=>{const close=e=>{if(accountRef.current&&!accountRef.current.contains(e.target))setAccountOpen(false)};document.addEventListener('pointerdown',close);return()=>document.removeEventListener('pointerdown',close)},[]);
 useEffect(()=>{const handler=e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();document.getElementById('nav-search')?.focus()}if(e.key==='Escape'){setMobile(false);setAccountOpen(false)}};document.addEventListener('keydown',handler);return()=>document.removeEventListener('keydown',handler)},[]);
 const doSearch=e=>{e.preventDefault();nav(`/explore?q=${encodeURIComponent(query)}`)};
 const logOut=async()=>{if(!supabase)return;const{error}=await supabase.auth.signOut();if(error){notify(error.message,'error');return}setAccountOpen(false);setMobile(false);nav('/',{replace:true})};
 const links=[{path:'/explore',text:'Explore notes'},{path:'/subjects',text:'Subjects'},{path:'/requests',text:'Requests'},{path:'/guides',text:'Guides'}];
 return <div className="site-frame">
 <header className="nav"><div className="nav-inner"><Logo/><div className="nav-links">{links.map(l=><Link key={l.path} to={l.path} className={loc.pathname.startsWith(l.path)?'nav-active':''}>{l.text}</Link>)}</div>
 <form className="nav-search" onSubmit={doSearch}><Search size={18}/><input id="nav-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search your next a-ha moment..." aria-label="Search notes"/><kbd>⌘ K</kbd></form>
 <div className="nav-actions"><button className="icon-button theme-button" onClick={()=>setTheme(theme==='light'?'dark':'light')} aria-label="Toggle theme">{theme==='light'?<Moon size={19}/>:<Sun size={19}/>}</button>
 {canInstall&&<Button variant="outline" className="desktop-install" onClick={install}><Download size={16}/> Install</Button>}
 {session?<div className="account-menu-wrap" ref={accountRef}>
 <button type="button" className="avatar account-trigger" aria-haspopup="menu" aria-expanded={accountOpen} aria-label="Open account menu" onClick={()=>setAccountOpen(v=>!v)}>{session.user.email?.[0]?.toUpperCase()}<ChevronDown size={13}/></button>
 {accountOpen&&<div className="account-menu" role="menu">
 <div className="account-menu-email" title={session.user.email}>{session.user.email}</div>
 <Link role="menuitem" to="/dashboard"><LayoutDashboard size={16}/> Dashboard</Link>
 <Link role="menuitem" to="/library"><FolderHeart size={16}/> My library</Link>
 <Link role="menuitem" to="/upload"><Upload size={16}/> Upload notes</Link>
 <Link role="menuitem" to="/profile"><UserRound size={16}/> Profile settings</Link>
 {isAdmin&&<><Link role="menuitem" to="/admin"><ShieldCheck size={16}/> Moderation</Link><Link role="menuitem" to="/admin/feedback"><BookOpen size={16}/> Feedback & statistics</Link><Link role="menuitem" to="/admin/bulk-upload"><CloudUpload size={16}/> Bulk upload</Link></>}<Link role="menuitem" to="/offline"><Download size={16}/> Offline PDFs</Link>
 <button type="button" role="menuitem" className="account-signout" onClick={logOut}><LogOut size={16}/> Log out</button>
 </div>}
 </div>:<Link className="btn btn-primary login-btn" to="/login">Get started <ArrowRight size={16}/></Link>}
 <button className="icon-button hamburger" aria-label="Open menu" aria-expanded={mobile} onClick={()=>setMobile(!mobile)}>{mobile?<X/>:<Menu/>}</button></div></div></header>
 {mobile&&<div className="mobile-menu">{links.map(l=><Link key={l.path} to={l.path}>{l.text}</Link>)}<Link to="/upload">Upload notes</Link><Link to="/dashboard">My dashboard</Link><Link to="/library" className="mobile-quick-link">My library</Link><Link to="/offline" className="mobile-quick-link">Offline PDFs</Link><Link to="/install">Install app</Link>{session&&<button type="button" onClick={logOut}><LogOut size={16}/> Log out</button>}</div>}
 {!configured&&<div className="demo-strip"><Info size={14}/><span><strong>Preview mode:</strong> sample PDFs work now. Connect Supabase to enable student accounts and public uploads.</span><Link to="/guides#setup">Setup guide <ArrowRight size={13}/></Link></div>}
 <main>{children}</main>
 <footer className="footer"><div className="footer-grid">
 <div className="footer-brand"><Logo/><p>Free study notes, shared by learners. Find a resource or contribute your own.</p><div className="footer-cta"><Link className="btn btn-primary" to="/explore"><BookOpen size={17}/> Explore notes <ArrowRight size={16}/></Link><Link className="btn btn-outline" to="/upload"><Upload size={17}/> Share notes</Link></div></div>
 <div className="footer-group"><h4>Explore</h4><Link to="/subjects">Subjects</Link><Link to="/requests">Note requests</Link><Link to="/guides">Study guides</Link><Link to="/community">Community</Link><Link to="/reviews">Public reviews</Link></div>
 <div className="footer-group"><h4>Your library</h4><Link to="/dashboard">Dashboard</Link><Link to="/library">Saved notes</Link><Link to="/offline">Offline PDFs</Link><Link to="/install">Install app <Smartphone size={15}/></Link></div>
 <div className="footer-group"><h4>Help & information</h4><Link to="/about">About & FAQ</Link><Link to="/feedback">Share feedback</Link><Link to="/policies">Privacy & terms</Link><Link to="/policies#copyright">Copyright requests</Link>{isAdmin&&<Link to="/admin/feedback">Admin feedback</Link>}</div>
 </div><div className="footer-bottom"><span>© {new Date().getFullYear()} NotesHub</span><div className="footer-privacy"><AnalyticsSettings/></div><a href="https://github.com/nikkipandey-8599" target="_blank" rel="noopener noreferrer">Made by Nikki Pandey ↗</a></div></footer>
 {toast&&<div className={`toast toast-${toast.type}`} role="status"><span>{toast.message}</span><button onClick={clearToast} aria-label="Dismiss notification"><Check size={15}/></button></div>}
 <InstallBanner/>
 <EdgeDeck/>
 </div>
}
export function NoteCard({note,index=0,compact=false}){
 const{bookmarks,toggleBookmark}=useApp();const saved=bookmarks.includes(note.id);
 return <article className={`note-card paper-${note.color||'lavender'} ${compact?'note-card-compact':''}`} style={{animationDelay:`${(index%8)*55}ms`}}>
 <div className="note-card-top"><span className="paper-tab">{note.subject}</span>{note.is_starter&&<span className="sample-chip" title="Original example PDF provided by NotesHub">Sample note</span>}<button className={`bookmark-button ${saved?'saved':''}`} onClick={()=>toggleBookmark(note.id)} aria-label={saved?'Unsave':'Save note'}><Bookmark size={18} fill={saved?'currentColor':'none'}/></button></div>
 <Link to={`/notes/${note.id}`} className="note-card-body"><span className="note-card-icon"><FileText size={21}/></span><h3>{note.title}</h3><p>{note.description}</p></Link>
 <div className="note-tags">{(note.tags||[]).slice(0,2).map(t=><span key={t}>#{t}</span>)}</div>
 <div className="note-card-bottom"><div className="note-meta"><span>{note.semester||'Any level'}</span><span className="dot">·</span><span>{note.course||'General learning'}</span></div><Link aria-label={`View ${note.title}`} to={`/notes/${note.id}`} className="round-arrow"><ArrowRight size={17}/></Link></div>
 </article>
}
export function EdgeDeck(){
 const{notes,bookmarks}=useApp(),[open,setOpen]=useState(false);const saved=notes.filter(n=>bookmarks.includes(n.id)).slice(0,4);const items=saved.length?saved:notes.filter(n=>n.is_starter).slice(0,3);
 return <div className={'edge-deck '+(open?'edge-open':'')}><button className="edge-toggle" onClick={()=>setOpen(!open)} aria-label="Toggle quick deck"><BookMarked size={18}/><span>Quick deck</span><ChevronLeft size={14}/></button><div className="edge-cards"><div className="edge-head"><span>Your little deck</span><button onClick={()=>setOpen(false)} aria-label="Close"><X size={17}/></button></div>{items.map((n,i)=><Link key={n.id} to={`/notes/${n.id}`} onClick={()=>setOpen(false)} className={`edge-paper edge-paper-${n.color||'lavender'}`}><span>{String(i+1).padStart(2,'0')}</span><strong>{n.title}</strong><ArrowRight size={15}/></Link>)}<Link className="edge-all" to="/library" onClick={()=>setOpen(false)}>Open my library <ArrowRight size={15}/></Link><Link className="edge-all" to="/offline" onClick={()=>setOpen(false)}>Offline PDFs <Download size={15}/></Link></div></div>
}
export function DashShell({children,title,subtitle,action}){
 const loc=useLocation();const items=[{url:'/dashboard',label:'Overview',icon:LayoutDashboard},{url:'/library',label:'My library',icon:FolderHeart},{url:'/upload',label:'Upload a note',icon:CloudUpload},{url:'/profile',label:'My profile',icon:UserRound}];const{isAdmin}=useApp();items.push({url:'/offline',label:'Offline PDFs',icon:Download});if(isAdmin)items.push({url:'/admin',label:'Moderation',icon:ShieldCheck},{url:'/admin/feedback',label:'Feedback & statistics',icon:BookOpen},{url:'/admin/bulk-upload',label:'Bulk upload',icon:CloudUpload});
 return <div className="dashboard-shell container"><aside className="dash-sidebar"><p className="mini-eyebrow">YOUR WORKSPACE</p>{items.map(({url,label,icon:Icon})=><Link className={loc.pathname===url?'dash-link active':'dash-link'} to={url} key={url}><Icon size={18}/>{label}</Link>)}<div className="sidebar-help"><BookOpen size={26}/><strong>Share what you know.</strong><span>Your notes might be someone else's a-ha moment.</span><Link to="/upload">Contribute <ArrowRight size={14}/></Link></div></aside><section className="dash-body"><div className="page-head"><div><p className="mini-eyebrow">NOTESHUB SPACE</p><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div>{action}</div>{children}</section></div>
}
export function Status({status}){const dict={approved:['Approved','mint'],pending:['In review','yellow'],rejected:['Rejected','pink']};return <Pill color={(dict[status]||['', 'lavender'])[1]}>{(dict[status]||[status])[0]}</Pill>}