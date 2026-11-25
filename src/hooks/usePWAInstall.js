// Adapted to NotesHub from the browser install flow used by ExamBrain.
import { useEffect, useState } from 'react';

let installEvent = null;
const listeners = new Set();
let dismissed = false;

const isInstalled = () => typeof window !== 'undefined' && (
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
);
const announce = () => listeners.forEach(listener => listener());

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installEvent = event;
    dismissed = false;
    announce();
  });
  window.addEventListener('appinstalled', () => {
    installEvent = null;
    dismissed = true;
    announce();
  });
}

export function usePWAInstall() {
  const [, refresh] = useState(0);
  useEffect(() => {
    const update = () => refresh(n => n + 1);
    listeners.add(update);
    return () => listeners.delete(update);
  }, []);

  const installed = isInstalled();
  const canInstall = Boolean(installEvent) && !installed;
  const showBanner = canInstall && !dismissed;

  async function install() {
    if (!installEvent) return false;
    const prompt = installEvent;
    installEvent = null;
    announce();
    await prompt.prompt();
    const choice = await prompt.userChoice;
    announce();
    return choice.outcome === 'accepted';
  }
  function dismiss() { dismissed = true; announce(); }
  return { installed, canInstall, showBanner, install, dismiss };
}