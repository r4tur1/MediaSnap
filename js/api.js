// API Configuration
// Swap this with your production Render URL when deploying
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:8000' 
    : 'https://mediasnap-backend.onrender.com';

/**
 * Fetches media info from the backend.
 * @param {string} url The media URL.
 * @returns {Promise<object>} Parsed JSON response.
 */
async function fetchMediaInfo(url) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch media info');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Returns the full download URL for the specified format.
 * @param {string} url The media URL.
 * @param {string} formatId The format ID to download.
 * @returns {string} Full download URL.
 */
function getDownloadUrl(url, formatId) {
    return `${API_BASE_URL}/api/download?url=${encodeURIComponent(url)}&format_id=${encodeURIComponent(formatId)}`;
}

/**
 * Fetches the current download progress for a task.
 * @param {string} taskId The task ID to track.
 * @returns {Promise<object>} Progress data.
 */
async function fetchProgress(taskId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/progress/${taskId}`);
        if (!response.ok) {
            return { progress: 0, status: 'unknown' };
        }
        return await response.json();
    } catch (error) {
        console.error('Progress API Error:', error);
        return { progress: 0, status: 'error' };
    }
}
