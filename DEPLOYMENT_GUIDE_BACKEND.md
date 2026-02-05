# How to Deploy the Backend (So you don't have to keep your laptop on)

Currently, your backend is running **locally** on your laptop (`localhost`). If you close your terminal or turn off your computer, the AI stops working.

To make it run 24/7, you need to **deploy the backend** to a cloud provider.

## Recommended: Render (Free Tier available)

We recommend **Render** because it is easy to set up for Node.js apps.

### Step 1: Push your code to GitHub
Make sure your latest code (including the `backend/` folder) is pushed to your GitHub repository.
*(We have been auto-pushing for you, so this is likely done!)*

### Step 2: Deploy to Render
1.  Go to [Render.com](https://render.com/) and create a free account.
2.  Click **"New +"** -> **"Web Service"**.
3.  Connect your **GitHub** account and select your `juriq` repository.
4.  **Configure the Service:**
    *   **Name:** `juriq-backend`
    *   **Root Directory:** `backend` (Important! This tells Render the server is in the subfolder)
    *   **Environment:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `npm start`
    *   **Instance Type:** Free

5.  **Environment Variables (Advanced Button):**
    Click "Add Environment Variable" and add your keys from your `.env` file:
    *   Key: `GEMINI_API_KEY`  Value: `AIzaSy...` (Paste your real key)
    *   Key: `PORT`            Value: `3000` (or leave empty, Render asks for port)

6.  Click **Create Web Service**.

### Step 3: Update Frontend
Once Render finishes deploying, it will give you a URL like:
`https://juriq-backend.onrender.com`

You need to tell your Frontend to talk to *that* URL instead of `localhost`.

1.  Open `pages/Dashboard.tsx`.
2.  Find: `fetch('http://localhost:3000/api/chat', ...)`
3.  Replace with: `fetch('https://juriq-backend.onrender.com/api/chat', ...)`
4.  Commit and Push. Your Vercel frontend will update automatically.

---

## Technical Summary
*   **Frontend (Vercel):** Static files (HTML/CSS/JS). Runs in user's browser.
*   **Backend (Render/Localhost):** The "Brain". Runs the Node.js server that talks to Gemini.
*   **Connection:** The Frontend sends messages to the Backend URL. If that URL is `localhost`, it only works on YOUR machine. If it is `render.com`, it works everywhere.
