import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogInPage() {
  const navigate = useNavigate();

  const handleInstagramClick = () => {
    navigate('/instagram-login');
  };

  const handleXClick = () => {
    navigate('/x-login');
  };

  const handleTiktokClick = () => {
    navigate('/tiktok-login');
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
        TikTok
      </button>

    </div>
  );
}

export default LogInPage;
