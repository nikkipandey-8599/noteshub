import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import App from './App.jsx';
import './styles/main.css';

// vite-plugin-pwa generates and registers the service worker in production.
// Do not register the old public/sw.js here.
createRoot(document.getElementById('root')).render(
  <React.StrictMode><BrowserRouter><AppProvider><App /></AppProvider></BrowserRouter></React.StrictMode>
);