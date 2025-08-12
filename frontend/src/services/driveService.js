import axios from 'axios';

const BACKEND_URL = 'http://localhost:3000'; // TODO: Use environment variable

export async function listDriveFiles(jwtToken) {
  try {
    const response = await axios.get(`${BACKEND_URL}/drive/list`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error listing Drive files:', error);
    throw error;
  }
}

export async function uploadFile(jwtToken, fileData) {
  try {
    const response = await axios.post(`${BACKEND_URL}/drive/upload`, fileData, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/octet-stream', // Adjust content type as needed
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file to Drive:', error);
    throw error;
  }
}
