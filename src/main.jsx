import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import App from './App.jsx';
import './styles/main.css';

class ErrorBoundary extends React.Component {state={failed:false};static getDerivedStateFromError(){return {failed:true}} componentDidCatch(error){console.error('NotesHub render error',error)} render(){return this.state.failed?<main role="alert" style={{padding:32}}><h1>Something went wrong</h1><p>Please reload NotesHub to try again.</p><button onClick={()=>location.reload()}>Reload</button></main>:this.props.children}}

// vite-plugin-pwa generates and registers the service worker in production.
// Do not register the old public/sw.js here.
createRoot(document.getElementById('root')).render(
  <React.StrictMode><ErrorBoundary><BrowserRouter><AppProvider><App /></AppProvider></BrowserRouter></ErrorBoundary></React.StrictMode>
);