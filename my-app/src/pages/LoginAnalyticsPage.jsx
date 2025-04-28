import React from 'react';
import { useNavigate } from 'react-router-dom';

function LoginAnalyticsPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // ➔ Go to LogInPage
  };

  const handleSignUpClick = () => {
    navigate('/create-account'); // ➔ Go to CreateAccountPage
  };

  return (
    <div style={{
      backgroundColor: '#0f172a',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '50px 40px',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0px 4px 20px rgba(0,0,0,0.2)'
      }}>
        
        {/* Heading */}
        <h2 style={{
          color: 'black',
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '30px'
        }}>
          Log In
        </h2>

        {/* Google Button */}
        <button style={{
          width: '100%',
          padding: '12px',
          marginBottom: '10px',
          backgroundColor: 'white',
          color: 'black',
          border: '1px solid black',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <img src="/google-logo.png" alt="Google Logo" style={{ width: '20px' }} />
          Sign up with Google
        </button>

        {/* Facebook Button */}
        <button style={{
          width: '100%',
          padding: '12px',
          marginBottom: '20px',
          backgroundColor: 'white',
          color: 'black',
          border: '1px solid black',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <img src="/facebook-logo.png" alt="Facebook Logo" style={{ width: '20px' }} />
          Sign up with Facebook
        </button>

        {/* OR Separator */}
        <div style={{
          width: '100%',
          textAlign: 'center',
          marginBottom: '20px',
          position: 'relative'
        }}>
          <div style={{
            borderBottom: '1px solid lightgray',
            width: '100%',
            position: 'absolute',
            top: '50%',
            zIndex: 1
          }}></div>
          <span style={{
            backgroundColor: 'white',
            padding: '0 10px',
            position: 'relative',
            zIndex: 2,
            fontWeight: 'bold',
            fontSize: '12px',
            color: 'gray'
          }}>
            OR
          </span>
        </div>

        {/* Email Input */}
        <input 
          type="email" 
          placeholder="Email" 
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '8px',
            border: '1px solid lightgray',
            backgroundColor: '#fafafa',
            fontSize: '14px'
          }}
        />

        {/* Password Input */}
        <input 
          type="password" 
          placeholder="Password" 
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '20px',
            borderRadius: '8px',
            border: '1px solid lightgray',
            backgroundColor: '#fafafa',
            fontSize: '14px'
          }}
        />

        {/* Login Button */}
        <button
          onClick={handleLoginClick}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'black',
            color: 'white',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          Login
        </button>

        {/* Don't have an account */}
        <div style={{
          fontSize: '13px',
          color: 'black',
          textAlign: 'center'
        }}>
          Don't have an account?{' '}
          <span
            onClick={handleSignUpClick}
            style={{
              color: '#1e40af',
              textDecoration: 'none',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Sign Up
          </span>
        </div>

      </div>
    </div>
  );
}

export default LoginAnalyticsPage;
