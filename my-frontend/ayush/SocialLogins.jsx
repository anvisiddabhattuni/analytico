/* SocialLogins.css */

/* Container styles */
.login-container {
    /* Matches the dark background you showed in Figma */
    background-color: #0f1a2b;
    width: 100vw;
    height: 100vh;
  
    /* Centers content vertically and horizontally */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  /* Shared button styles */
  .login-button {
    margin: 1rem;
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    color: #ffffff;
    transition: background-color 0.2s ease-in-out;
  }
  
  /* Instagram button */
  .instagram {
    background-color: #e1306c; /* Typical Instagram pink hue */
  }
  
  .instagram:hover {
    background-color: #bf285c;
  }
  
  /* X button (formerly Twitter) */
  .x {
    background-color: #1da1f2;
  }
  
  .x:hover {
    background-color: #157ab4;
  }
  
  /* TikTok button */
  .tiktok {
    background-color: #000000;
  }
  
  .tiktok:hover {
    background-color: #222222;
  }
  