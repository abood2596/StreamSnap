function startDownload() {
  const url = document.getElementById('urlInput').value.trim();
  const format = document.getElementById('formatSelect').value;
  const quality = document.getElementById('qualitySelect').value;
  const status = document.getElementById('status');
  const progressBar = document.getElementById('progressBar');
  const downloadBtn = document.querySelector('button');

  if (!url) {
    status.textContent = "Please enter a YouTube URL.";
    status.style.color = "#ff4b4b";
    return;
  }

  // Reset UI
  progressBar.style.width = "0%";
  status.textContent = "Preparing download...";
  status.style.color = "#fff";
  downloadBtn.disabled = true;
  downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';

  // استبدل هذا الرابط برابط Replit الخاص بك
  const serverUrl = 'https://your-project-name.your-username.repl.co/download';
  
  fetch(serverUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ 
      url, 
      format, 
      quality 
    })
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => { throw new Error(err.error || "Failed to download"); });
    }
    
    const contentLength = +response.headers.get('Content-Length');
    let receivedLength = 0;
    
    const reader = response.body.getReader();
    const chunks = [];
    
    function pump() {
      return reader.read().then(({ done, value }) => {
        if (done) {
          const blob = new Blob(chunks);
          handleDownloadComplete(blob);
          return;
        }
        
        chunks.push(value);
        receivedLength += value.length;
        
        // Progress update (حساب نسبة التحميل الفعلية إذا كان Content-Length متوفر)
        const progress = contentLength ? Math.round((receivedLength / contentLength) * 100) : progressBar.style.width;
        progressBar.style.width = `${progress}%`;
        status.textContent = `Downloading... ${progress}%`;
        
        return pump();
      });
    }
    
    return pump();
  })
  .catch(error => {
    console.error('Download error:', error);
    progressBar.style.width = "0%";
    status.textContent = "Error: " + error.message;
    status.style.color = "#ff4b4b";
    downloadBtn.disabled = false;
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
  });

  function handleDownloadComplete(blob) {
    progressBar.style.width = "100%";
    status.textContent = "Download complete!";
    status.style.color = "#4CAF50";
    
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `streamsnap_${format === 'mp3' ? 'audio' : 'video'}.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    
    // تحرير الذاكرة بعد التنزيل
    setTimeout(() => {
      window.URL.revokeObjectURL(downloadUrl);
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
    }, 100);
  }
}