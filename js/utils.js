/**
 * Detects the platform based on the provided URL.
 * @param {string} url The media URL.
 * @returns {object} Platform details.
 */
function detectPlatform(url) {
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
        return { name: "YouTube", color: "#FF0000", icon: "yt.svg", id: "youtube" };
    } else if (lowerUrl.includes('instagram.com')) {
        return { name: "Instagram", color: "#E4405F", icon: "ig.svg", id: "instagram" };
    } else if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch')) {
        return { name: "Facebook", color: "#1877F2", icon: "fb.svg", id: "facebook" };
    } else if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
        return { name: "Twitter/X", color: "#000000", icon: "tw.svg", id: "twitter" };
    } else if (lowerUrl.includes('tiktok.com')) {
        return { name: "TikTok", color: "#000000", icon: "tk.svg", id: "tiktok" };
    } else if (lowerUrl.includes('vimeo.com')) {
        return { name: "Vimeo", color: "#1AB7EA", icon: "vm.svg", id: "vimeo" };
    } else if (lowerUrl.includes('soundcloud.com')) {
        return { name: "SoundCloud", color: "#FF3300", icon: "sc.svg", id: "soundcloud" };
    } else if (lowerUrl.includes('reddit.com')) {
        return { name: "Reddit", color: "#FF4500", icon: "rd.svg", id: "reddit" };
    } else if (lowerUrl.includes('dailymotion.com')) {
        return { name: "Dailymotion", color: "#0066DC", icon: "dm.svg", id: "dailymotion" };
    } else if (lowerUrl.includes('twitch.tv')) {
        return { name: "Twitch", color: "#9146FF", icon: "th.svg", id: "twitch" };
    }
    
    return { name: "Unknown", color: "#666666", icon: "globe.svg", id: "unknown" };
}

/**
 * Formats duration in seconds to H:MM:SS or M:SS.
 * @param {number} seconds Duration in seconds.
 * @returns {string} Formatted duration.
 */
function formatDuration(seconds) {
    if (!seconds) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Formats file size in bytes to human-readable format.
 * @param {number} bytes File size in bytes.
 * @returns {string} Formatted file size.
 */
function formatFileSize(bytes) {
    if (!bytes) return "Unknown size";
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Formats a timestamp to a readable date.
 * @param {number} timestamp Unix timestamp.
 * @returns {string} Formatted date.
 */
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Formats large numbers (like view counts) with suffixes.
 * @param {number} num Number to format.
 * @returns {string} Formatted number.
 */
function formatNumber(num) {
    if (!num) return "0";
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}
