import React, { useState } from 'react';
import './App.css';

const ROLES = ['Job Seeker', 'Employer', 'Admin'];

function App() {
  const [users, setUsers] = useState([]); // {name, password, role}
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('Job Seeker');
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Frontend Developer', company: 'Tech Corp', location: 'Remote', applicants: [] },
    { id: 2, title: 'Backend Engineer', company: 'DataSoft', location: 'New York', applicants: [] },
  ]);
  const [form, setForm] = useState({ title: '', company: '', location: '' });
  const [search, setSearch] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);

  // Login form state
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Sign up form state
  const [signUpName, setSignUpName] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState('Job Seeker');
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState('');

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.name === loginName && u.password === loginPassword);
    if (user) {
      setUsername(user.name);
      setRole(user.role);
      setIsLoggedIn(true);
      setLoginName('');
      setLoginPassword('');
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setRole('Job Seeker');
  };

  // Sign up handler
  const handleSignUp = (e) => {
    e.preventDefault();
    if (!signUpName.trim() || !signUpPassword.trim()) {
      setSignUpError('Please fill in all fields');
      setSignUpSuccess('');
      return;
    }
    if (users.find(u => u.name === signUpName)) {
      setSignUpError('Username already exists');
      setSignUpSuccess('');
      return;
    }
    setUsers([...users, { name: signUpName, password: signUpPassword, role: signUpRole }]);
    setSignUpError('');
    setSignUpSuccess('Sign up successful! You can now log in.');
    setSignUpName('');
    setSignUpPassword('');
    setSignUpRole('Job Seeker');
  };

  // Filter jobs for job seeker
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase())
  );

  // Handle job form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.title && form.company && form.location) {
      setJobs([
        ...jobs,
        { id: jobs.length + 1, ...form, applicants: [] }
      ]);
      setForm({ title: '', company: '', location: '' });
    }
  };

  // Handle apply
  const handleApply = (jobId) => {
    setJobs(jobs.map(job =>
      job.id === jobId && !job.applicants.includes(username)
        ? { ...job, applicants: [...job.applicants, username] }
        : job
    ));
  };

  // Handle delete (admin)
  const handleDelete = (jobId) => {
    setJobs(jobs.filter(job => job.id !== jobId));
  };

  // Auth pages
  if (!isLoggedIn) {
    return (
      <div className={showSignUp ? 'auth-bg signup-bg' : 'auth-bg login-bg'}>
        <div className="App auth-box">
          {showSignUp ? (
            <>
              <h1>Sign Up</h1>
              <form onSubmit={handleSignUp} className="login-form">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={signUpName}
                  onChange={e => setSignUpName(e.target.value)}
                  required
                  className="login-input"
                />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={signUpPassword}
                  onChange={e => setSignUpPassword(e.target.value)}
                  required
                  className="login-input"
                />
                <select value={signUpRole} onChange={e => setSignUpRole(e.target.value)} className="login-select">
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <button type="submit" className="login-btn">Sign Up</button>
                {signUpError && <div className="auth-error">{signUpError}</div>}
                {signUpSuccess && <div className="auth-success">{signUpSuccess}</div>}
              </form>
              <div className="auth-toggle">Already have an account? <button onClick={() => { setShowSignUp(false); setSignUpError(''); setSignUpSuccess(''); }} className="auth-link">Login</button></div>
            </>
          ) : (
            <>
              <h1>Login</h1>
              <form onSubmit={handleLogin} className="login-form">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={loginName}
                  onChange={e => setLoginName(e.target.value)}
                  required
                  className="login-input"
                />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  required
                  className="login-input"
                />
                <button type="submit" className="login-btn">Login</button>
                {loginError && <div className="auth-error">{loginError}</div>}
              </form>
              <div className="auth-toggle">Don't have an account? <button onClick={() => { setShowSignUp(true); setLoginError(''); }} className="auth-link">Sign Up</button></div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Main app
  return (
    <div className="App">
      <div className="top-bar">
        <span>Welcome, <strong>{username}</strong>!</span>
        <span style={{marginLeft: 16}}>Role: <strong>{role}</strong></span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      <h1>Job Board</h1>
      {role === 'Job Seeker' && (
        <>
          <input
            className="job-search"
            type="text"
            placeholder="Search jobs by title, company, or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ marginBottom: 20, width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #d1d5db' }}
          />
          <ul className="job-list">
            {filteredJobs.length === 0 ? (
              <li className="job-item">No jobs found.</li>
            ) : (
              filteredJobs.map((job) => (
                <li key={job.id} className="job-item">
                  <strong>{job.title}</strong> at {job.company} ({job.location})
                  <br />
                  {job.applicants.includes(username) ? (
                    <span className="applied-label">Applied</span>
                  ) : (
                    <button className="apply-btn" onClick={() => handleApply(job.id)}>
                      Apply
                    </button>
                  )}
                </li>
              ))
            )}
          </ul>
        </>
      )}
      {role === 'Employer' && (
        <>
          <form onSubmit={handleSubmit} className="job-form">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Job Title"
              required
            />
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company"
              required
            />
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
              required
            />
            <button type="submit">Post Job</button>
          </form>
          <h2 style={{marginTop: 30}}>Posted Jobs</h2>
          <ul className="job-list">
            {jobs.length === 0 ? (
              <li className="job-item">No jobs posted yet.</li>
            ) : (
              jobs.map((job) => (
                <li key={job.id} className="job-item">
                  <strong>{job.title}</strong> at {job.company} ({job.location})
                  <br />
                  <span className="applicants-label">Applicants: {job.applicants.length}</span>
                </li>
              ))
            )}
          </ul>
        </>
      )}
      {role === 'Admin' && (
        <>
          <h2>All Jobs (Admin)</h2>
          <ul className="job-list">
            {jobs.length === 0 ? (
              <li className="job-item">No jobs available.</li>
            ) : (
              jobs.map((job) => (
                <li key={job.id} className="job-item">
                  <strong>{job.title}</strong> at {job.company} ({job.location})
                  <br />
                  <span className="applicants-label">Applicants: {job.applicants.length}</span>
                  <button className="delete-btn" onClick={() => handleDelete(job.id)}>
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
