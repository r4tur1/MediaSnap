/**
 * Builds and renders the preview card for the media.
 * @param {object} data The media info data from the backend.
 * @param {HTMLElement} container The container to render the card into.
 * @param {string} originalUrl The original media URL.
 */
function renderPreviewCard(data, container, originalUrl) {
    container.innerHTML = '';
    container.classList.remove('hidden');
    container.classList.add('fade-in');

    const videoFormats = data.formats.filter(f => f.type === 'video');
    const audioFormats = data.formats.filter(f => f.type === 'audio');

    const card = document.createElement('div');
    card.className = 'preview-card-content';
    card.innerHTML = `
        <div class="preview-thumb">
            <img src="${data.thumbnail}" alt="${data.title}" onerror="this.src='assets/icons/placeholder.svg'">
        </div>
        <div class="preview-info">
            <h2 class="preview-title">${data.title}</h2>
            <p class="preview-uploader">${data.uploader}</p>
            <div class="preview-meta">
                <span>${formatDuration(data.duration)}</span>
                <span>${formatNumber(data.view_count)} views</span>
            </div>
            
            <div class="format-selector">
                <div class="tabs">
                    <button class="tab-btn active" data-tab="video">Video</button>
                    <button class="tab-btn" data-tab="audio">Audio Only</button>
                </div>
                
                <div id="video-formats" class="format-list">
                    ${videoFormats.map(f => `
                        <div class="format-pill" data-id="${f.format_id}" data-label="${f.label}" data-ext="${f.ext}" data-filesize="${f.filesize}">
                            <span>${f.label} · ${f.ext.toUpperCase()} · ${formatFileSize(f.filesize)}</span>
                            <button class="copy-btn-mini" title="Copy Stream URL" data-url="${originalUrl}" data-id="${f.format_id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </button>
                        </div>
                    `).join('')}
                </div>
                
                <div id="audio-formats" class="format-list hidden">
                    ${audioFormats.map(f => `
                        <div class="format-pill" data-id="${f.format_id}" data-label="${f.label}" data-ext="${f.ext}" data-filesize="${f.filesize}">
                            <span>${f.label} · ${f.ext.toUpperCase()} · ${formatFileSize(f.filesize)}</span>
                            <button class="copy-btn-mini" title="Copy Stream URL" data-url="${originalUrl}" data-id="${f.format_id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <button id="download-btn" class="primary-btn full-width" style="margin-top: 20px;" disabled>
                Select a Format
            </button>
        </div>
    `;

    container.appendChild(card);

    // Tab switching logic
    const tabBtns = card.querySelectorAll('.tab-btn');
    const videoList = card.querySelector('#video-formats');
    const audioList = card.querySelector('#audio-formats');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (btn.dataset.tab === 'video') {
                videoList.classList.remove('hidden');
                audioList.classList.add('hidden');
            } else {
                videoList.classList.add('hidden');
                audioList.classList.remove('hidden');
            }
        });
    });

    // Format selection logic
    const formatPills = card.querySelectorAll('.format-pill');
    const downloadBtn = card.querySelector('#download-btn');
    let selectedFormat = null;

    formatPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            // Don't trigger if clicking the copy button
            if (e.target.closest('.copy-btn-mini')) return;

            formatPills.forEach(p => p.classList.remove('selected'));
            pill.classList.add('selected');
            
            selectedFormat = {
                id: pill.dataset.id,
                label: pill.dataset.label,
                ext: pill.dataset.ext,
                filesize: pill.dataset.filesize
            };
            
            downloadBtn.disabled = false;
            downloadBtn.textContent = `Download ${selectedFormat.label} (${selectedFormat.ext.toUpperCase()})`;
        });
    });

    // Copy link logic
    const copyBtns = card.querySelectorAll('.copy-btn-mini');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const downloadUrl = getDownloadUrl(btn.dataset.url, btn.dataset.id);
            navigator.clipboard.writeText(downloadUrl).then(() => {
                const originalSvg = btn.innerHTML;
                btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                setTimeout(() => { btn.innerHTML = originalSvg; }, 2000);
            });
        });
    });

    // Download button logic
    downloadBtn.addEventListener('click', () => {
        if (!selectedFormat) return;

        // Save to history
        const platform = detectPlatform(originalUrl);
        saveToHistory({
            title: data.title,
            thumbnail: data.thumbnail,
            url: originalUrl,
            format_id: selectedFormat.id,
            label: selectedFormat.label,
            ext: selectedFormat.ext,
            filesize: selectedFormat.filesize,
            platformName: platform.name,
            platformColor: platform.color
        });

        // Update history strip if on index page
        if (typeof updateHistoryStrip === 'function') {
            updateHistoryStrip();
        }

        // Trigger download
        const downloadUrl = getDownloadUrl(originalUrl, selectedFormat.id);
        window.open(downloadUrl, '_blank');
        
        // Start progress polling (simulated or real if backend supports)
        startProgressPolling(data.title);
    });
}

/**
 * Starts polling the backend for download progress.
 * @param {string} title The title of the media being downloaded.
 */
function startProgressPolling(title) {
    const progressContainer = document.getElementById('progress-container');
    const progressTitle = document.getElementById('progress-title');
    const progressPercent = document.getElementById('progress-percent');
    const progressBarFill = document.getElementById('progress-bar-fill');

    if (!progressContainer) return;

    progressContainer.classList.remove('hidden');
    progressTitle.textContent = `Downloading: ${title}`;
    
    // In a real app, you'd get a task ID from the download request
    // Here we'll simulate it for the UI demo
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                progressContainer.classList.add('hidden');
            }, 3000);
        }
        
        progressPercent.textContent = `${Math.round(progress)}%`;
        progressBarFill.style.width = `${progress}%`;
    }, 500);
}
