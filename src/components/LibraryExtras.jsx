import React from 'react';
import {Link,useParams} from 'react-router-dom';
import {useApp} from '../context/AppContext';
import {NoteCard,Empty} from './UI';
export function LibrarySkeleton(){return <div className="notes-grid" role="status" aria-label="Loading study resources">{Array.from({length:6},(_,i)=><div className="nh-skeleton" key={i} aria-hidden="true"><span/><span/><span/><span/></div>)}</div>}
export function ContributorPage(){const {id}=useParams(),{notes,loading}=useApp();const items=notes.filter(n=>!n.is_starter&&n.status==='approved'&&n.owner_id===id);return <div className="container basic-page"><Link to="/explore">← Explore library</Link>{loading?<LibrarySkeleton/>:items.length?<><div className="page-banner"><span className="kicker">COMMUNITY CONTRIBUTOR</span><h1>Contributor's notes</h1><p>{items.length} published resources · Public contributions only</p></div><div className="notes-grid">{items.map((n,i)=><NoteCard key={n.id} note={n} index={i}/>)}</div></>:<Empty title="No public contributions" text="This contributor has no currently available notes."/>}</div>}
