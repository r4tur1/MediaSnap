# MediaSnap

MediaSnap is a frontend-only web application designed to preview and download media from various platforms. Users can paste a video/audio link, view a preview card with metadata and format options, and then download their chosen format. The application is built with a focus on simplicity and efficiency, utilizing plain HTML, CSS, and Vanilla JavaScript for the frontend, and Python with FastAPI and yt-dlp for the backend.

<!--![Screenshot Placeholder](screenshot.png)                    yet to add-->

## Features

MediaSnap offers a comprehensive suite of features for managing media downloads. The core functionality revolves around a media link previewer, where users can paste a video or audio link to instantly see a preview card containing the title, uploader, duration, thumbnail, and view count. From this preview, users can select their preferred format from a detailed list that includes resolution, extension, and file size, and then initiate the download directly to their device.

The application also includes a dedicated download history page, allowing users to keep track of their past downloads. It supports a wide range of platforms, ensuring versatility. For a personalized viewing experience, MediaSnap features a dark/light mode toggle and is fully responsive, optimized for both mobile and desktop devices.

In addition to the core features, MediaSnap includes several advanced capabilities. A batch mode allows users to input multiple URLs for parallel fetching, displaying mini-previews for each. Users can also copy direct yt-dlp stream URLs to their clipboard directly from the format pills. A convenient keyboard shortcut (Ctrl+V) enables auto-pasting and fetching from anywhere on the page. During downloads, a progress indicator provides real-time feedback by polling a backend endpoint. The application also displays platform-specific warnings, such as login requirements for Instagram or Facebook, and includes a PWA manifest, allowing the site to be installed on mobile devices.

## Local Development Setup

To set up MediaSnap for local development, follow these steps:

1 .  **Clone the repository:** Clone the project to your local machine.
2.  **Install Python dependencies:** Navigate to the `backend` directory and install the required packages using `pip install -r requirements.txt`.
3.  **Run the backend:** Start the FastAPI server by running `uvicorn main:app --reload` in the `backend` directory.
4.  **Open the frontend:** Open the `index.html` file in your web browser.

## Deployment Instructions

Deploying MediaSnap involves setting up both the frontend and the backend.

**Frontend Deployment (GitHub Pages):**
The frontend is designed to be hosted on GitHub Pages. Simply push the frontend files (HTML, CSS, JS, assets) to a GitHub repository and enable GitHub Pages in the repository settings. Ensure that the `API_BASE_URL` in `js/api.js` is configured to point to your production backend URL.

**Backend Deployment (Render):**
The backend can be deployed to Render using their free tier. Create a new Web Service on Render, connect your repository, and set the build command to `pip install -r requirements.txt && apt-get install -y ffmpeg`. Set the start command to `uvicorn main:app --host 0.0.0.0 --port $PORT`.

## Environment Variables

The backend requires the following environment variables to be set:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `ALLOWED_ORIGINS` | A comma-separated list of allowed origins for CORS. | `https://yourusername.github.io,http://localhost:8000` |

## Supported Platforms

MediaSnap supports a variety of platforms, including but not limited to:

| Platform | Example URL Format |
| :--- | :--- |
| YouTube | `https://www.youtube.com/watch?v=...` |
| Instagram | `https://www.instagram.com/p/...` |
| Facebook | `https://www.facebook.com/watch/?v=...` |
| Twitter/X | `https://twitter.com/.../status/...` |
| TikTok | `https://www.tiktok.com/@.../video/...` |
| Vimeo | `https://vimeo.com/...` |
| SoundCloud | `https://soundcloud.com/...` |
| Reddit | `https://www.reddit.com/r/.../comments/...` |
| Dailymotion | `https://www.dailymotion.com/video/...` |
| Twitch | `https://clips.twitch.tv/...` |

## Known Limitations

While MediaSnap is designed to be robust, there are some known limitations:

*   **Private Content:** Downloading private content, such as private Instagram posts, may require cookies or authentication, which is not currently supported (I will work on this later).
*   **Age-Restricted Content:** Age-restricted content on platforms like YouTube may fail to download without authentication.
*   **FFmpeg Requirement:** The backend requires FFmpeg to be installed on the server for certain format conversions and merging.

## License

This project is licensed under the MIT License.
