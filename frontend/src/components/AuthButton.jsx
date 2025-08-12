import React from 'react';
import { getDeviceId } from '../utils/device';
import { startOAuth } from '../services/authService';

function AuthButton() {
  const handleLogin = async () => {
    const deviceId = getDeviceId();
    try {
      const authUrl = await startOAuth(deviceId);
      if (authUrl) {
        window.open(authUrl, '_blank');
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Handle error, e.g., show a message to the user
    }
  };

  return (
    <button onClick={handleLogin}>
      Login com Google
    </button>
  );
}

export default AuthButton;
