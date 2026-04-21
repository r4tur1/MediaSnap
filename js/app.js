document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const body = document.body;
    
    const urlInput = document.getElementById('url-input');
    const pasteBtn = document.getElementById('paste-btn');
    const fetchBtn = document.getElementById('fetch-btn');
    const platformBadge = document.getElementById('platform-badge');
    const platformIcon = document.getElementById('platform-icon');
    const platformName = document.getElementById('platform-name');
    
    const batchModeToggle = document.getElementById('batch-mode-toggle');
    const batchInputContainer = document.getElementById('batch-input-container');
    const batchUrlInput = document.getElementById('batch-url-input');
    const batchFetchBtn = document.getElementById('batch-fetch-btn');
    const inputSection = document.getElementById('input-section');
    
    const warningBanner = document.getElementById('warning-banner');
    const warningText = document.getElementById('warning-text');
    
    const loadingSkeleton = document.getElementById('loading-skeleton');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    const previewCard = document.getElementById('preview-card');
    const batchPreviews = document.getElementById('batch-previews');
    
    const historyStrip = document.getElementById('history-strip');

    // Theme Toggle Logic
    const savedTheme = localStorage.getItem('mediasnap_theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('mediasnap_theme', newTheme);
        updateThemeIcons(newTheme);
    });

    function updateThemeIcons(theme) {
        if (theme === 'dark') {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    }

    // Platform Badge Logic
    urlInput.addEventListener('input', () => {
        const url = urlInput.value.trim();
        if (url) {
            const platform = detectPlatform(url);
            if (platform.id !== 'unknown') {
                platformBadge.classList.remove('hidden');
                platformName.textContent = platform.name;
                platformBadge.style.backgroundColor = `${platform.color}1a`; // 10% opacity
                platformBadge.style.borderColor = platform.color;
                platformBadge.style.color = platform.color;
                
                // Show platform specific warnings
                if (platform.id === 'instagram' || platform.id === 'facebook') {
                    warningBanner.classList.remove('hidden');
                    warningText.textContent = `${platform.name} may require login for some content. If download fails, try a public post.`;
                } else {
                    warningBanner.classList.add('hidden');
                }
            } else {
                platformBadge.classList.add('hidden');
                warningBanner.classList.add('hidden');
            }
        } else {
            platformBadge.classList.add('hidden');
            warningBanner.classList.add('hidden');
        }
    });

    // Paste Button Logic
    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            urlInput.value = text;
            urlInput.dispatchEvent(new Event('input'));
        } catch (err) {
            console.error('Failed to read clipboard:', err);
        }
    });

    // Fetch Button Logic
    fetchBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        if (!url) return;

        // Reset UI
        previewCard.classList.add('hidden');
        errorContainer.classList.add('hidden');
        loadingSkeleton.classList.remove('hidden');
        fetchBtn.disabled = true;
        fetchBtn.innerHTML = '<div class="spinner"></div> Fetching...';

        try {
            const data = await fetchMediaInfo(url);
            loadingSkeleton.classList.add('hidden');
            renderPreviewCard(data, previewCard, url);
        } catch (error) {
            loadingSkeleton.classList.add('hidden');
            errorContainer.classList.remove('hidden');
            errorMessage.textContent = error.message;
        } finally {
            fetchBtn.disabled = false;
            fetchBtn.textContent = 'Fetch';
        }
    });

    // Batch Mode Toggle Logic
    batchModeToggle.addEventListener('change', () => {
        if (batchModeToggle.checked) {
            batchInputContainer.classList.remove('hidden');
            document.querySelector('.input-group').classList.add('hidden');
            platformBadge.classList.add('hidden');
        } else {
            batchInputContainer.classList.add('hidden');
            document.querySelector('.input-group').classList.remove('hidden');
            urlInput.dispatchEvent(new Event('input'));
        }
    });

    // Batch Fetch Logic
    batchFetchBtn.addEventListener('click', async () => {
        const urls = batchUrlInput.value.trim().split('\n').filter(url => url.trim());
        if (urls.length === 0) return;

        batchPreviews.innerHTML = '';
        batchPreviews.classList.remove('hidden');
        batchFetchBtn.disabled = true;
        batchFetchBtn.innerHTML = '<div class="spinner"></div> Fetching All...';

        try {
            const results = await Promise.all(urls.map(async (url) => {
                try {
                    const data = await fetchMediaInfo(url.trim());
                    return { url, data, success: true };
                } catch (error) {
                    return { url, error: error.message, success: false };
                }
            }));

            results.forEach(result => {
                const previewItem = document.createElement('div');
                previewItem.className = 'card batch-preview-item';
                if (result.success) {
                    const platform = detectPlatform(result.url);
                    previewItem.innerHTML = `
                        <div class="batch-preview-thumb">
                            <img src="${result.data.thumbnail}" alt="${result.data.title}">
                        </div>
                        <div class="batch-preview-info">
                            <h4>${result.data.title}</h4>
                            <span class="platform-badge-mini" style="background-color: ${platform.color}">${platform.name}</span>
                        </div>
                    `;
                    previewItem.addEventListener('click', () => {
                        batchModeToggle.checked = false;
                        batchModeToggle.dispatchEvent(new Event('change'));
                        urlInput.value = result.url;
                        urlInput.dispatchEvent(new Event('input'));
                        renderPreviewCard(result.data, previewCard, result.url);
                        previewCard.scrollIntoView({ behavior: 'smooth' });
                    });
                } else {
                    previewItem.innerHTML = `<p class="error-text">Error: ${result.error}</p><p class="small-url">${result.url}</p>`;
                }
                batchPreviews.appendChild(previewItem);
            });
        } catch (error) {
            console.error('Batch fetch error:', error);
        } finally {
            batchFetchBtn.disabled = false;
            batchFetchBtn.textContent = 'Fetch All';
        }
    });

    // Keyboard Shortcut (Ctrl+V)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
            // If not focused on an input/textarea, auto-paste and fetch
            if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                navigator.clipboard.readText().then(text => {
                    if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
                        urlInput.value = text;
                        urlInput.dispatchEvent(new Event('input'));
                        fetchBtn.click();
                    }
                });
            }
        }
    });

    // History Strip Logic
    window.updateHistoryStrip = function() {
        const history = getHistory();
        if (history.length === 0) {
            historyStrip.innerHTML = '<p class="empty-msg">No downloads yet.</p>';
            return;
        }

        historyStrip.innerHTML = '';
        // Show last 5 items
        history.slice(0, 5).forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item-mini';
            historyItem.innerHTML = `
                <div class="history-thumb-mini">
                    <img src="${item.thumbnail}" alt="${item.title}" onerror="this.src='assets/icons/placeholder.svg'">
                </div>
                <p class="history-title-mini">${item.title}</p>
            `;
            historyItem.addEventListener('click', () => {
                urlInput.value = item.url;
                urlInput.dispatchEvent(new Event('input'));
                fetchBtn.click();
            });
            historyStrip.appendChild(historyItem);
        });
    };

    // Initial load
    updateHistoryStrip();

    // Check if there's a pre-filled URL from history page
    const prefUrl = localStorage.getItem('mediasnap_pref_url');
    if (prefUrl) {
        urlInput.value = prefUrl;
        localStorage.removeItem('mediasnap_pref_url');
        urlInput.dispatchEvent(new Event('input'));
        fetchBtn.click();
    }
});
