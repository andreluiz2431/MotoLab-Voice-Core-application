import axios from 'axios';

const BACKEND_URL = 'http://localhost:3000'; // TODO: Use environment variable

export async function startOAuth(deviceId) {
  try {
    const response = await axios.get(`${BACKEND_URL}/auth/start?deviceId=${deviceId}`);
    return response.data.authUrl;
  } catch (error) {
    console.error('Error starting OAuth process:', error);
    throw error;
  }
}
