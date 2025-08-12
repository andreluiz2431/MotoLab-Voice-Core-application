import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AuthButton from './components/AuthButton';
import { getDeviceId } from './utils/device';
import { checkAuthStatus } from './services/authService';

function App() {
  const [count, setCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const deviceId = getDeviceId();
    let intervalId;

    const checkStatus = async () => {
      try {
        const authenticated = await checkAuthStatus(deviceId);
        setIsAuthenticated(authenticated);
        if (authenticated) {
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error('Failed to check auth status:', error);
      }
    };

    // Initial check
    checkStatus();

    // Poll every 5 seconds
    intervalId = setInterval(checkStatus, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {!isAuthenticated && <AuthButton />}
      {isAuthenticated && <p>User is authenticated!</p>}
    </>
  );
}

export default App;
