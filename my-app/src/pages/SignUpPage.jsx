import React from 'react';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/create-account');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div style={{
      background: 'linear-gradient(to bottom, #0f172a, #1e3a8a)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '20px'
    }}>
      
      {/* Buttons aligned top-right */}
      <div style={{
        alignSelf: 'flex-end',
        marginRight: '20px',
      }}>
        <button
          onClick={handleRegisterClick}
          style={{
            margin: '10px',
            padding: '10px 20px',
            backgroundColor: '#f97316',
            color: 'black',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          REGISTER
        </button>

        <button
          onClick={handleLoginClick}
          style={{
            margin: '10px',
            padding: '10px 20px',
            backgroundColor: '#f97316',
            color: 'black',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          LOGIN
        </button>
      </div>

      {/* Logo Center */}
      <img 
        src="/AnalyticoLogo.png" 
        alt="Analytico Logo"
        style={{
          marginTop: '100px',
          width: '900px',
          height: 'auto',
          outline: 'none',
          border: 'none'
        }}
      />
      
    </div>
  );
}

export default SignUpPage;
