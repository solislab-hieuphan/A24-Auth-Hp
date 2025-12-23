import React from 'react';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';

function App() {
  return (
    <div className="container">
      <h1 className="title">A24 Press</h1>
      <p className="subtitle">Advanced Press API Access</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button className="btn">
          <LogIn size={20} />
          Sign In
        </button>
        
        <button className="btn btn-secondary">
          <ShieldCheck size={20} color="var(--accent)" />
          Universal Login
        </button>
        
        <div className="text-base" style={{ margin: '1rem 0' }}>
          OR
        </div>

        <button className="btn btn-secondary">
          <UserPlus size={20} />
          Create New Account
        </button>
      </div>
    </div>
  );
}

export default App;
