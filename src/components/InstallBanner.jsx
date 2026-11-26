import React from 'react';
import { useLocation } from 'react-router-dom';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export default function InstallBanner() {
  const { showBanner, install, dismiss } = usePWAInstall();
  const { pathname } = useLocation();
  if (!showBanner || pathname !== "/") return null;
  return <section className="pwa-install-banner" aria-label="Install NotesHub">
    <img src="/icons/icon-192.png" width="44" height="44" alt="" />
    <div className="pwa-install-copy"><strong>Take NotesHub with you ✳</strong>
      <span>Install it on your device for quick access.</span>
    </div>
    <button type="button" className="btn btn-primary" onClick={install}><Download size={16}/> Install</button>
    <button type="button" className="icon-button" onClick={dismiss} aria-label="Dismiss install offer"><X size={18}/></button>
  </section>;
}
