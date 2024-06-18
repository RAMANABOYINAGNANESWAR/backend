import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const endpoint = isLogin ? '/login' : '/register';
    const payload = isLogin
      ? { username, password }
      : { name, email, phone, username, password };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const text = await response.text();
      setMessage(text);
      if (response.status === 200 && isLogin) {
        navigate('/dashboard', { state: { username } });
      } else if (response.status === 201 && !isLogin) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          setIsLogin(true);
        }, 3000);
      }
    } catch (error) {
      setMessage('Error connecting to the server');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setUsername('');
    setPassword('');
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="App">
      <div className="form-container">
        <h1>{isLogin ? 'Login' : 'Register'}</h1>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="input-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={!isLogin}
                />
              </div>
              <div className="input-group">
                <label htmlFor="phone">Mobile Number:</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required={!isLogin}
                  maxLength="10"
                />
              </div>
            </>
          )}
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        {message && <p className="message">{message}</p>}
        <button onClick={toggleForm} className="toggle-button">
          {isLogin ? 'New User' : 'Switch to Login'}
        </button>
      </div>
      {showPopup && <PopupMessage />}
    </div>
  );
}

function PopupMessage() {
  return (
    <div className="popup">
      <h2>Registration Successful!</h2>
      <p>Welcome! Please log in.</p>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state || {};

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="dashboard">
      <button onClick={handleLogout} className="logout-button">Logout</button>
      <h1>Hello, {username}!</h1>
      <p>Welcome to your dashboard.</p>
      
    </div>
  );
}

export default App;
