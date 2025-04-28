import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function InstagramLogInPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/loading-instagram'); // ➔ Go to LoadingPageInstagram
  };

  useEffect(() => {
    // Auto-redirect from LoadingPageInstagram → InstagramDashFree already handled there
  }, []);

  return (
    <div style={{
      backgroundColor: '#fafafa',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row'
    }}>
      
      {/* Left Side - Phone Image */}
      <div style={{
        marginRight: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <img 
          src="/InstagramPhone.png" 
          alt="Instagram Phone" 
          style={{ height: '600px', objectFit: 'contain' }}
        />
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        border: '1px solid lightgray',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '350px',
        borderRadius: '8px',
        boxShadow: '0 0 5px rgba(0,0,0,0.1)'
      }}>
        {/* Instagram Text Logo */}
        <h1 style={{
          fontFamily: "'Grand Hotel', Billabong",
          fontSize: '48px',
          marginBottom: '20px'
        }}>
          Instagram
        </h1>

        {/* Inputs */}
        <input 
          type="text" 
          placeholder="Phone number, username, or email" 
          style={{
            width: '75%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid lightgray',
            backgroundColor: '#fafafa',
            fontSize: '14px'
          }}
        />

        <input 
          type="password" 
          placeholder="Password" 
          style={{
            width: '75%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid lightgray',
            backgroundColor: '#fafafa',
            fontSize: '14px'
          }}
        />

        {/* Log In Button */}
        <button
          onClick={handleLoginClick}
          style={{
            width: '80%',
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: '#0095f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Log In
        </button>

        {/* OR Separator */}
        <div style={{ 
          margin: '10px 0', 
          display: 'flex',
          alignItems: 'center',
          width: '80%',
          color: 'gray',
          fontSize: '12px'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'lightgray' }}></div>
          <span style={{ margin: '0 10px', fontWeight: 'bold' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'lightgray' }}></div>
        </div>

        {/* Log in with Facebook */}
        <button style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: 'transparent',
          color: '#385185',
          border: 'none',
          fontWeight: 'bold',
          fontSize: '14px',
          cursor: 'pointer'
        }}>
          Log in with Facebook
        </button>

        {/* Forgot Password */}
        <div style={{
          marginBottom: '20px',
          fontSize: '12px',
          color: '#00376b',
          cursor: 'pointer'
        }}>
          Forgot password?
        </div>

        {/* Bottom Sign Up Link */}
        <div style={{
          marginTop: '20px',
          fontSize: '14px',
          color: 'black',
          textAlign: 'center'
        }}>
          Don't have an account? <a href="/signup" style={{ color: '#0095f6', textDecoration: 'none' }}>Sign up</a>
        </div>

      </div>
    </div>
  );
}

export default InstagramLogInPage;
