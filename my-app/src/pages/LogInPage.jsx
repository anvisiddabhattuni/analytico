import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/api';

function LogInPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login-analytics');
    }
  }, [navigate]);

  const handleInstagramClick = () => {
    navigate('/instagram-login'); // ➔ Go to InstagramLogInPage
  };

  const handleXClick = () => {
    navigate('/x-login'); // ➔ Go to SignXPage
  };

  const handleTiktokClick = () => {
    navigate('/tiktok-login'); // ➔ Go to SignTikTokPage
  };

  return (
    <div style={{
      backgroundColor: '#0f172a',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      
      {/* Instagram Login Button */}
      <button 
        onClick={handleInstagramClick}
        style={{
          margin: '15px',
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '30px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Instagram Login
      </button>

      {/* X Login Button */}
      <button 
        onClick={handleXClick}
        style={{
          margin: '15px',
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '30px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        X Login
      </button>

      {/* TikTok Login Button */}
      <button 
        onClick={handleTiktokClick}
        style={{
          margin: '15px',
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '30px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        TikTok Login
      </button>

    </div>
  );
}

export default LogInPage;
