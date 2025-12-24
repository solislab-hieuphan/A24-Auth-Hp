import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogIn, UserPlus, LogOut, ShieldCheck, Mail, Calendar, Phone, User, Key, Loader2, ArrowLeft } from 'lucide-react';
import auth0 from 'auth0-js';

const domain = process.env.REACT_APP_AUTH0_DOMAIN || "";
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || "";

const responseType = 'token id_token';
const scope = 'openid profile email';

const webAuth = new auth0.WebAuth({
  domain: domain,
  clientID: clientId,
  responseType: responseType,
  scope: scope
});

// Namespace cho custom claims
const AUTH0_NAMESPACE = 'https://auth.a24-press.com';

function App() {
  const { 
    loginWithRedirect, 
    logout, 
    user, 
    isLoading 
  } = useAuth0();

  const [view, setView] = useState<'home' | 'custom-signup' | 'custom-signin' | 'custom-forgot-password'>('home');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customUser, setCustomUser] = useState<any>(null);

  React.useEffect(() => {
    if (window.location.hash) {
      webAuth.parseHash((err, authResult) => {
        if (authResult && authResult.idTokenPayload) {
          setCustomUser(authResult.idTokenPayload);
          window.history.replaceState(null, "", window.location.pathname);
        } else if (err) {
          console.error("Error parsing hash:", err);
        }
      });
    }
  }, []);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    phone: '',
    dob: ''
  });

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center' }}>
        <Loader2 className="animate-spin" style={{ margin: '0 auto' }} />
        <div className="title" style={{ marginTop: '1rem' }}>Loading...</div>
      </div>
    );
  }

  const handleCustomSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setIsSubmitting(true);
    webAuth.signup({
      connection: 'Username-Password-Authentication',
      email: formData.email,
      password: formData.password,
      username: formData.username,
      userMetadata: {
        date_of_birth: formData.dob,
        phone_number: formData.phone
      }
    }, function (err) {
      setIsSubmitting(false);
      if (err) {
        alert("Error: " + err.description);
        return;
      }
      alert("Registration successful! Please check your email to verify.");
      setView('custom-signin');
    });
  };

  const handleCustomSignin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    webAuth.login({
      realm: 'Username-Password-Authentication',
      email: formData.email,
      password: formData.password,
      redirectUri: window.location.origin,
      responseType: responseType,
      scope: scope
    } as any, function (err: any) {
      setIsSubmitting(false);
      if (err) {
        alert("Error: " + err.description);
        return;
      }
    });
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      alert("Please enter your email!");
      return;
    }
    setIsSubmitting(true);
    webAuth.changePassword({
      connection: 'Username-Password-Authentication',
      email: formData.email,
    }, function (err, resp) {
      setIsSubmitting(false);
      if (err) {
        alert("Error: " + err.description);
        return;
      }
      alert("A password reset email has been sent to: " + formData.email);
      setView('custom-signin');
    });
  };

  const displayUser = user || customUser;

  if (displayUser) {
    return (
      <div className="container profile-card">
        <div 
          className="avatar" 
          style={{ backgroundImage: `url(${displayUser.picture})` }}
        />
        <div className="user-info">
          <h2 className="user-name">{displayUser.name || displayUser.nickname || displayUser.email}</h2>
          <p className="user-email">{displayUser.email}</p>
        </div>
        
        <div style={{ textAlign: 'left', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <p style={{ color: '#94a3b8', marginBottom: '0.25rem' }}>Account Status</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="#4ade80" />
              <span>Successfully Authenticated {customUser ? "(Custom Form)" : ""}</span>
            </div>
          </div>

          {(displayUser[`${AUTH0_NAMESPACE}/phone_number`] || displayUser['phone_number']) && (
            <div>
              <p style={{ color: '#94a3b8', marginBottom: '0.25rem' }}>Phone Number</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="var(--accent)" />
                <span>{displayUser[`${AUTH0_NAMESPACE}/phone_number`] || displayUser['phone_number']}</span>
              </div>
            </div>
          )}

          {(displayUser[`${AUTH0_NAMESPACE}/date_of_birth`] || displayUser['date_of_birth']) && (
            <div>
              <p style={{ color: '#94a3b8', marginBottom: '0.25rem' }}>Date of Birth</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="var(--accent)" />
                <span>{displayUser[`${AUTH0_NAMESPACE}/date_of_birth`] || displayUser['date_of_birth']}</span>
              </div>
            </div>
          )}
        </div>

        <button 
          className="btn btn-secondary" 
          onClick={() => {
            setCustomUser(null);
            logout({ logoutParams: { returnTo: window.location.origin } });
          }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    );
  }

  if (view === 'custom-signup') {
    return (
      <div className="container">
        <button className="btn-back" onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="title">A24 Press</h1>
        <p className="subtitle">Create your secure account</p>
        <form onSubmit={handleCustomSignup}>
          <div className="form-group">
            <label><User size={14} style={{ marginRight: 4 }} /> Username</label>
            <input type="text" placeholder="johndoe" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
          </div>
          <div className="form-group">
            <label><Mail size={14} style={{ marginRight: 4 }} /> Email Address</label>
            <input type="email" placeholder="name@company.com" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label><Phone size={14} style={{ marginRight: 4 }} /> Phone Number</label>
            <input type="tel" placeholder="+1234567890" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="form-group">
            <label><Calendar size={14} style={{ marginRight: 4 }} /> Date of Birth</label>
            <input type="date" required value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
          </div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label><Key size={14} style={{ marginRight: 4 }} /> Password</label>
              <input type="password" placeholder="••••••••" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Confirm</label>
              <input type="password" placeholder="••••••••" required value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
          </button>
        </form>
        <div className="links">
          Already have an account? <button className="link-btn" onClick={() => setView('custom-signin')}>Sign In</button>
        </div>
      </div>
    );
  }

  if (view === 'custom-signin') {
    return (
      <div className="container">
        <button className="btn-back" onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="title">A24 Press</h1>
        <p className="subtitle">Sign in to your account</p>
        <form onSubmit={handleCustomSignin}>
          <div className="form-group">
            <label><Mail size={14} style={{ marginRight: 4 }} /> Email Address</label>
            <input type="email" placeholder="name@company.com" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label><Key size={14} style={{ marginRight: 4 }} /> Password</label>
            <input type="password" placeholder="••••••••" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>
        <div className="links">
          <button className="link-btn" onClick={() => setView('custom-forgot-password')}>Forgot Password?</button>
          <div style={{ marginTop: '0.5rem' }}>
            Don't have an account? <button className="link-btn" onClick={() => setView('custom-signup')}>Sign Up</button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'custom-forgot-password') {
    return (
      <div className="container">
        <button className="btn-back" onClick={() => setView('custom-signin')} style={{ background: 'none', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Back to Sign In
        </button>
        <h1 className="title">Reset Password</h1>
        <p className="subtitle">Enter your email and we'll send you a link to reset your password.</p>
        <form onSubmit={handleForgotPassword}>
          <div className="form-group">
            <label><Mail size={14} style={{ marginRight: 4 }} /> Email Address</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              required 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">A24 Press</h1>
      <p className="subtitle">Advanced Press API Access</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button className="btn" onClick={() => setView('custom-signin')}>
          <LogIn size={20} />
          Custom Sign In
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={() => loginWithRedirect()}
          style={{ background: 'rgba(99, 102, 241, 0.1)', borderColor: 'var(--accent)' }}
        >
          <ShieldCheck size={20} color="var(--accent)" />
          Sign In via Auth0 App
        </button>
        
        <div className="text-base text-uppercase">
          OR
        </div>

        <button 
          className="btn btn-secondary" 
          onClick={() => setView('custom-signup')}
        >
          <UserPlus size={20} />
          Create New Account
        </button>
      </div>

      <div className="links" style={{ marginTop: '1.5rem' }}>
        <button className="link-btn" onClick={() => loginWithRedirect({ authorizationParams: { action: 'forgot-password' } } as any)}>
          Forgot Password Via Auth0 App?
        </button>
        <button className="link-btn" onClick={() => setView('custom-forgot-password')}>Forgot Password?</button>
      </div>
    </div>
  );
}

export default App;
