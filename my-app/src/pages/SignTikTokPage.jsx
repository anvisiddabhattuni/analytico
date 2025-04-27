import React from 'react';

function SignTikTokPage() {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
    }}>
      
      {/* TikTok Logo at the Top Left */}
      <img 
        src="/TikTok_logo.png" 
        alt="TikTok Logo" 
        style={{ 
          width: '120px', 
          position: 'absolute', 
          top: '20px', 
          left: '20px' 
        }}
      />

      {/* Feedback and Help at the Top Right */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        color: 'black',
        cursor: 'pointer'
      }}>
        <span style={{ 
          display: 'inline-block', 
          width: '20px', 
          height: '20px', 
          border: '1px solid black',
          borderRadius: '50%',
          textAlign: 'center',
          lineHeight: '18px',
          marginRight: '8px',
          fontWeight: 'bold'
        }}>?</span>
        Feedback and help
      </div>

      {/* Main content */}
      <div style={{
        marginTop: '80px',
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Sign up for TikTok</h2>
        <p style={{ textAlign: 'center', fontSize: '12px', marginBottom: '20px', color: '#6b7280' }}>
          Create a profile, follow other accounts, make your own videos, and more.
        </p>

        {/* Phone or email button */}
        <button style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: 'white',
          color: 'black',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '14px',
          cursor: 'pointer',
        }}>
          📱 Use phone or email
        </button>

        {/* Facebook button */}
        <button style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: 'white',
          color: 'black',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '14px',
          cursor: 'pointer',
        }}>
          <img 
            src="/facebook-logo.png" 
            alt="Facebook Logo" 
            style={{ width: '20px', marginRight: '8px' }}
          />
          Continue with Facebook
        </button>

        {/* Google button */}
        <button style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: 'white',
          color: 'black',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '14px',
          cursor: 'pointer',
        }}>
          <img 
            src="/google-logo.png" 
            alt="Google Logo" 
            style={{ width: '20px', marginRight: '8px' }}
          />
          Continue with Google
        </button>

        {/* Apple button */}
        <button style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: 'white',
          color: 'black',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '14px',
          cursor: 'pointer',
        }}>
          <img 
            src="/AppleLogo.png" 
            alt="Apple Logo" 
            style={{ width: '20px', marginRight: '8px' }}
          />
          Continue with Apple
        </button>

        {/* Terms and Privacy Policy text */}
        <p style={{
          textAlign: 'center',
          fontSize: '10px',
          color: '#6b7280',
          marginTop: '10px',
          maxWidth: '260px'
        }}>
          By continuing, you agree to TikTok's <span style={{ textDecoration: 'underline' }}>Terms of Service</span> and confirm that you have read TikTok's <span style={{ textDecoration: 'underline' }}>Privacy Policy</span>.
        </p>

        {/* Divider */}
        <hr style={{
          marginTop: '30px',
          width: '100%',
          border: 'none',
          borderTop: '1px solid #e5e7eb'
        }} />

        {/* Bottom signup link */}
        <p style={{
          marginTop: '10px',
          fontSize: '13px',
          color: '#6b7280'
        }}>
          Already have an account? <a href="/login" style={{ color: 'red', textDecoration: 'none' }}>Log in</a>
        </p>
      </div>
    </div>
  );
}

export default SignTikTokPage;
