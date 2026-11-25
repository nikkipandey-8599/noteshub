const KEY='noteshub-analytics-consent';
const id=import.meta.env.VITE_GA_MEASUREMENT_ID;
export const analyticsEnabled=()=>/^G-[A-Z0-9]+$/.test(id||'');
export function consent(){try{return localStorage.getItem(KEY)||'unset'}catch{return 'unset'}}
let loaded=false;
function start(){if(!analyticsEnabled()||consent()!=='yes'||loaded)return;loaded=true;window['ga-disable-'+id]=false;window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};window.gtag('js',new Date());window.gtag('config',id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false});const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);document.head.append(s)}
export function setConsent(value){localStorage.setItem(KEY,value);if(value==='yes'){window['ga-disable-'+id]=false;start()}else{window['ga-disable-'+id]=true;for(const c of document.cookie.split(';')){const n=c.split('=')[0].trim();if(n==='_ga'||n.startsWith('_ga_')){document.cookie=n+'=; Max-Age=0; path=/';document.cookie=n+'=; Max-Age=0; path=/; domain=.'+location.hostname}}}window.dispatchEvent(new Event('nh-consent'))}
export function track(name,params={}){if(!analyticsEnabled()||consent()!=='yes')return;start();window.gtag?.('event',name,{...params,page_location:location.origin+location.pathname})}
