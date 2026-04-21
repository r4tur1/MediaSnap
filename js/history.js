const HISTORY_KEY = 'mediasnap_history';
const MAX_HISTORY_ITEMS = 50;

/**
 * Saves a download item to history in localStorage.
 * @param {object} item The download item to save.
 */
function saveToHistory(item) {
    try {
        let history = getHistory();
        
        // Remove duplicate if it exists (based on URL and format)
        history = history.filter(h => !(h.url === item.url && h.format_id === item.format_id));
        
        // Add to the beginning of the array
        history.unshift({
            ...item,
            timestamp: Date.now()
        });
        
        // Limit history size
        if (history.length > MAX_HISTORY_ITEMS) {
            history = history.slice(0, MAX_HISTORY_ITEMS);
        }
        
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        console.error('Error saving to history:', error);
    }
}

/**
 * Retrieves the download history from localStorage.
 * @returns {Array} Array of history items.
 */
function getHistory() {
    try {
        const history = localStorage.getItem(HISTORY_KEY);
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error('Error reading history:', error);
        return [];
    }
}

/**
 * Clears the download history from localStorage.
 */
function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
}
