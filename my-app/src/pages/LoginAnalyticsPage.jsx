import React from 'react';

function LoginAnalyticsPage() {
  return (
    <div style={{
      backgroundColor: '#0f172a',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        backgroundColor: '#f97316',
        padding: '90px',
        borderRadius: '20px',
        width: '250px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Heading */}
        <h2 style={{
          color: 'black',
          marginBottom: '20px',
          fontWeight: 'bold',
        }}>
          Log In
        </h2>

        {/* Google Button */}
        <button style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: 'white',
          color: 'black',
          fontWeight: 'bold',
          border: '1px solid black',
          borderRadius: '25px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img 
            src="/google-logo.png" 
            alt="Google Logo" 
            style={{ width: '20px', marginRight: '8px' }}
          />
          Sign up with Google
        </button>

        {/* Facebook Button */}
        <button style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: 'white',
          color: 'black',
          fontWeight: 'bold',
          border: '1px solid black',
          borderRadius: '25px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img 
            src="/facebook-logo.png" 
            alt="Facebook Logo" 
            style={{ width: '20px', marginRight: '8px' }}
          />
          Sign up with Facebook
        </button>

        {/* OR line */}
        <div style={{
          marginBottom: '20px',
          color: 'black',
          fontWeight: 'bold'
        }}>
          OR
        </div>

        {/* Email Input */}
        <input 
          type="email" 
          placeholder="johndoe@mail.com" 
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            border: '1px solid black',
            borderRadius: '6px'
          }}
        />

        {/* Password Input */}
        <input 
          type="password" 
          placeholder="Password" 
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
            border: '1px solid black',
            borderRadius: '6px'
          }}
        />

        {/* Create Account Button */}
        <button style={{
          width: '100%',
          padding: '10px',
          backgroundColor: 'black',
          color: 'white',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>
          Create Account
        </button>

        {/* Don't have an account text */}
        <div style={{
          marginTop: '15px',
          fontSize: '12px',
          color: 'black'
        }}>
          Don't have an account? <a href="/signup" style={{ color: 'blue', textDecoration: 'none' }}>Sign Up</a>
        </div>

      </div>
    </div>
  );
}

export default LoginAnalyticsPage;
