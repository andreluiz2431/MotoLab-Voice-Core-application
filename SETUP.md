# MotoLab Project Setup Guide

This guide provides instructions on how to set up and run the MotoLab Voice Core application, including both the backend and frontend components.

## 1. Prerequisites

Before you begin, ensure you have the following installed on your system:

*   **Node.js:** Version 18 or higher. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm:** Node Package Manager, which comes with Node.js.
*   **Git:** For cloning the repository and managing versions. Download from [git-scm.com](https://git-scm.com/).
*   **Android Studio:** Required for building and running the Android native plugin. Download from [developer.android.com/studio](https://developer.android.com/studio).

## 2. Project Setup

First, clone the project repository and navigate into the project directory:

```bash
git clone https://github.com/andreluiz2431/MotoLab-Voice-Core-application.git
cd MotoLab-Voice-Core-application
```

## 3. Backend Setup (Node.js + Express)

The backend is responsible for handling OAuth 2.0 authentication, storing tokens securely, and providing API endpoints for the frontend.

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `backend/` directory. This file will store sensitive information and configuration settings. Copy the content from `.env.example` (if available) or create it manually with the following structure:

    ```env
    PORT=3000
    JWT_SECRET=your_strong_jwt_secret_here
    GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
    GOOGLE_CLIENT_SECRET=your_google_client_secret_here
    GOOGLE_REDIRECT_URI=http://localhost:3000/oauth2callback
    ENCRYPTION_KEY=your_strong_encryption_key_here
    OPENAI_API_KEY=
    ```

    **Where to get these values:**
    *   `PORT`: The port your backend server will listen on. `3000` is common for development.
    *   `JWT_SECRET`: A strong, random string used for signing JWTs. Generate a long, random string.
    *   `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`:
        1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
        2.  Create a new project or select an existing one.
        3.  Navigate to "APIs & Services" > "Credentials".
        4.  Click "CREATE CREDENTIALS" > "OAuth client ID".
        5.  Select "Web application" as the Application type.
        6.  Add `http://localhost:3000/oauth2callback` (or your deployed backend URL) to "Authorized redirect URIs".
        7.  After creation, your Client ID and Client Secret will be displayed.
    *   `ENCRYPTION_KEY`: A strong, random string used for encrypting sensitive data (like refresh tokens) in the database. Generate a long, random string, different from `JWT_SECRET`.
    *   `OPENAI_API_KEY`: (Optional) Your OpenAI API key if you plan to use LLM proxy features.

4.  **Run the Backend:**
    ```bash
    npm start
    ```
    The backend server should start and listen on the configured port (default: 3000).

## 4. Frontend Setup (React + Capacitor)

The frontend provides the user interface and interacts with the backend and native plugins.

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Capacitor Setup:**
    Initialize Capacitor and add the Android platform. This will create the native Android project.

    ```bash
    npx cap init MotoLabApp com.motolab.app --web-dir dist
    npx cap add android
    ```

4.  **Run the Frontend (Web):**
    For web development, you can run the React app directly:
    ```bash
    npm run dev
    ```

5.  **Run the Frontend (Android):**
    To build and run the app on an Android device or emulator:
    ```bash
    npm run build
    npx cap sync android
    npx cap open android
    ```
    This will open the Android project in Android Studio, where you can build and run it on a connected device or emulator.

## 5. Native Plugin (Android) Notes

*   **Vosk Model:** The Vosk STT model (`model-en-us`) is expected to be placed in the Android project's `assets` folder. Ensure you have downloaded the correct model and placed it there for offline STT functionality.
*   **Permissions:** The Android application requests `BLUETOOTH_CONNECT` and `RECORD_AUDIO` permissions. These are declared in `frontend/android/app/src/main/AndroidManifest.xml` and handled at runtime by the `MotoLabPlugin.kt`.

## 6. Development Progress

Refer to `steps.md` in the project root for a detailed log of development tasks and their completion status.
