import React from 'react';
import { Button } from 'react-bootstrap';
import Image from 'next/image';
import { signIn } from '../utils/auth';

function Signin() {
  return (
    <div
      className="signin-container d-flex flex-column justify-content-center align-items-center"
      style={{
        height: '100vh',
        padding: '20px',
        // backgroundColor: '#f7f7f7',
      }}
    >
      {/* Logo Section */}
      <div className="logo" style={{ marginBottom: '30px' }}>
        <Image
          src="/images/horizon-logo-2.png"
          alt="Logo"
          width={400}
          height={400}
          objectFit="contain" // Ensures logo maintains aspect ratio
        />
      </div>

      {/* Text and Button */}
      <div className="text-center">
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>Welcome!</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '30px' }}>Please login to start completing tasks and earning rewards!</p>

        <Button
          type="button"
          size="lg"
          className="copy-btn"
          onClick={signIn}
          style={{
            backgroundColor: '#007bff', // Bootstrap primary color
            borderColor: '#007bff', // Border matching the button color
            color: '#fff', // White text
            padding: '10px 30px',
            fontSize: '1rem',
            borderRadius: '5px',
            transition: 'background-color 0.3s', // Smooth hover effect
          }}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}

export default Signin;
