import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Github, Gamepad2, Lock, Mail, UserRound } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/UI';

const PROVIDERS = [
  { id: 'google', name: 'Google', icon: <strong className="google-g" aria-hidden="true">G</strong> },
  { id: 'github', name: 'GitHub', icon: <Github size={18} aria-hidden="true" /> },
  { id: 'discord', name: 'Discord', icon: <Gamepad2 size={18} aria-hidden="true" /> },
];

export function AuthPage({ register = false }) {
  const { configured, supabase, user } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState(register ? 'register' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => setMode(register ? 'register' : 'login'), [register]);
  useEffect(() => { if (user) navigate('/dashboard', { replace: true }); }, [user, navigate]);

  async function socialSignIn(provider) {
    if (!configured) { setMessage('The live Supabase connection is missing. Check your environment variables.'); return; }
    setBusy(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) throw error;
      // Supabase redirects the browser to the chosen provider.
    } catch (error) {
      setMessage(error.message || 'Sign-in failed. Check the provider configuration in Supabase.');
      setBusy(false);
    }
  }

  async function submit(event) {
    event.preventDefault();
    if (!configured) { setMessage('Supabase is not connected. Add the public build variables and redeploy.'); return; }
    setBusy(true);
    setMessage('');
    try {
      if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage('If this account exists, a recovery link has been sent.');
        return;
      }
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name.trim() }, emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) throw error;
        if (data.session) navigate('/dashboard');
        else setMessage('Check your email for your confirmation link, then sign in.');
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.message || 'Something went wrong. Please try again.');
    } finally { setBusy(false); }
  }

  return <div className="auth-wrap container">
    <div className="auth-art"><div className="auth-paper">
      <span>✳ HERE'S TO NEW BEGINNINGS</span>
      <h2>Every great idea<br/>starts with<br/><i>a little note.</i></h2>
      <p>Keep learning. Keep sharing. Keep being curious.</p>
      <span className="auth-heart">♡</span>
    </div></div>
    <div className="auth-box">
      <span className="kicker">HELLO, CURIOUS MIND</span>
      <h1>{mode === 'register' ? 'Join the little library.' : mode === 'reset' ? 'Forgot your password?' : 'Welcome back.'}</h1>
      <p>{mode === 'register' ? 'Make your own space for every a-ha moment.' : mode === 'reset' ? 'We can email you a recovery link.' : 'Good to have you here. Your notes missed you.'}</p>
      {!configured && <div className="warning-note">Preview mode: this build has no Supabase credentials. Accounts are unavailable.</div>}
      {mode !== 'reset' && <>
        <div className="social-auth-grid">
          {PROVIDERS.map(provider => <button
            type="button" key={provider.id} disabled={busy || !configured}
            className="google-button social-auth-button"
            onClick={() => socialSignIn(provider.id)}
            aria-label={`Continue with ${provider.name}`}
          >{provider.icon}<span>{provider.name}</span></button>)}
        </div>
        
        <div className="auth-separator">or use email</div>
      </>}
      <form className="auth-form" onSubmit={submit}>
        {mode === 'register' && <label>Full name<div className="input-wrap">
          <UserRound size={18}/><input required maxLength={70} autoComplete="name"
            placeholder="What should we call you?" value={name} onChange={e => setName(e.target.value)}/>
        </div></label>}
        <label>Email address<div className="input-wrap"><Mail size={18}/>
          <input type="email" autoComplete="email" required placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
        </div></label>
        {mode !== 'reset' && <label>Password<div className="input-wrap"><Lock size={17}/>
          <input type={showPassword ? 'text' : 'password'} minLength={6} required
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            placeholder="At least 6 characters" value={password} onChange={e=>setPassword(e.target.value)}/>
          <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={()=>setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
        </div></label>}
        {mode === 'login' && <button type="button" className="forgot-link" onClick={()=>{setMode('reset');setMessage('');}}>Forgot password?</button>}
        {message && <div className="form-message" role="alert">{message}</div>}
        <Button type="submit" className="full" disabled={busy || !configured}>
          {busy ? 'Working...' : mode === 'register' ? 'Create my account' : mode === 'reset' ? 'Email recovery link' : 'Log in to NotesHub'} <ArrowRight size={17}/>
        </Button>
      </form>
      <div className="auth-swap">{mode === 'register'
        ? <>Have an account? <button type="button" onClick={()=>{setMode('login');setMessage('');}}>Log in</button></>
        : mode === 'reset'
          ? <button type="button" onClick={()=>{setMode('login');setMessage('');}}>← Back to login</button>
          : <>New around here? <button type="button" onClick={()=>{setMode('register');setMessage('');}}>Create an account</button></>}
      </div>
    </div>
  </div>;
}

export function ResetPassword() {
  const { configured, supabase } = useApp();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (!configured) return setMessage('Supabase is not connected.');
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setMessage(error ? error.message : 'Password updated! You can now sign in.');
    setBusy(false);
  }
  return <div className="container reset-wrap"><h1>Set your new password</h1>
    <form onSubmit={submit} className="auth-form">
      <label>New password<input type="password" autoComplete="new-password" minLength={6} required value={password} onChange={e=>setPassword(e.target.value)}/></label>
      <Button type="submit" disabled={busy}>{busy ? 'Updating...' : 'Update password'}</Button>
      <p role="status">{message}</p>
    </form>
  </div>;
}
