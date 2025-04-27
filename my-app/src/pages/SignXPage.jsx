import React from 'react';

function SignXPage() {
  return (
    <div style={{
        backgroundColor: '#0f172a',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      
      <div style={{
        backgroundColor: 'white',
        padding: '40px 30px 30px 30px',
        borderRadius: '10px',
        width: '600px',
        height: '700px',   // <<< 🎯 New added line!
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }}>

        {/* X Logo at the top */}
        <img 
          src="/Xlogo.png" 
          alt="X Logo"
          style={{
            width: '30px',
            height: '30px',
            marginBottom: '10px',
            marginTop: '-20px'
          }}
        />

        {/* Title */}
        <h2 style={{ 
          color: 'black', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          fontSize: '24px'
        }}>
          Sign in to X
        </h2>

        {/* Google Button */}
        <button style={{
          width: '75%',
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: 'white',
          color: 'black',
          fontWeight: 'bold',
          border: '1px solid lightgray',
          borderRadius: '30px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img src="/google-logo.png" alt="Google" style={{ width: '20px', marginRight: '8px' }} />
          Sign in with Google
        </button>

        {/* Apple Button */}
        <button style={{
          width: '75%',
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: 'white',
          color: 'black',
          fontWeight: 'bold',
          border: '1px solid lightgray',
          borderRadius: '30px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img src="/AppleLogo.png" alt="Apple" style={{ width: '20px', marginRight: '8px' }} />
          Sign in with Apple
        </button>

        {/* OR line */}
        <div style={{
          width: '75%',
          textAlign: 'center',
          marginBottom: '20px',
          color: 'gray',
          fontWeight: 'bold',
          position: 'relative'
        }}>
          <hr style={{
            position: 'absolute',
            width: '40%',
            top: '50%',
            left: 0,
            border: '0.5px solid lightgray'
          }} />
          <span style={{ backgroundColor: 'white', padding: '0 10px', position: 'relative', zIndex: 1 }}>or</span>
          <hr style={{
            position: 'absolute',
            width: '40%',
            top: '50%',
            right: 0,
            border: '0.5px solid lightgray'
          }} />
        </div>

        {/* Input box */}
        <input 
          type="text" 
          placeholder="Phone, email, or username" 
          style={{
            width: '75%',
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '6px',
            border: '1px solid lightgray'
          }}
        />

        {/* Next Button */}
        <button style={{
          width: '75%',
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: 'black',
          color: 'white',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer'
        }}>
          Next
        </button>

        {/* Forgot Password Button */}
        <button style={{
          width: '75%',
          padding: '10px',
          backgroundColor: 'white',
          color: 'black',
          fontWeight: 'bold',
          border: '1px solid lightgray',
          borderRadius: '30px',
          cursor: 'pointer'
        }}>
          Forgot password?
        </button>

        {/* Bottom text */}
        <div style={{
          marginTop: '20px',
          fontSize: '12px',
          color: 'gray'
        }}>
          Don't have an account? <a href="/signup" style={{ color: '#1DA1F2', textDecoration: 'none' }}>Sign up</a>
        </div>
      </div>
    </div>
  );
}

export default SignXPage;
