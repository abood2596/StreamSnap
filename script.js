function startDownload() {
  const url = document.getElementById('urlInput').value.trim();
  const format = document.getElementById('formatSelect').value;
  const quality = document.getElementById('qualitySelect').value;
  const status = document.getElementById('status');
  const progressBar = document.getElementById('progressBar');
  const downloadBtn = document.querySelector('button');

  if (!url) {
    status.textContent = "الرجاء إدخال رابط يوتيوب";
    status.style.color = "#ff4b4b";
    return;
  }

  progressBar.style.width = "0%";
  status.textContent = "جاري التحضير للتحميل...";
  status.style.color = "#fff";
  downloadBtn.disabled = true;
  downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';

  fetch('/download', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url, format, quality })
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => { 
        throw new Error(err.error || "فشل التحميل"); 
      });
    }
    return response.blob();
  })
  .then(blob => {
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `streamsnap_${format === 'mp3' ? 'audio' : 'video'}.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    
    progressBar.style.width = "100%";
    status.textContent = "تم التحميل بنجاح!";
    status.style.color = "#4CAF50";
    
    setTimeout(() => {
      window.URL.revokeObjectURL(downloadUrl);
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = '<i class="fas fa-download"></i> تحميل';
    }, 100);
  })
  .catch(error => {
    console.error('Download error:', error);
    progressBar.style.width = "0%";
    status.textContent = "خطأ: " + error.message;
    status.style.color = "#ff4b4b";
    downloadBtn.disabled = false;
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> تحميل';
  });
}

function extractVideoID(url) {
  const regExp = /^.*(youtu.be\/|v=|\/embed\/|\/shorts\/)([^#\&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function updateThumbnail() {
  const url = document.getElementById('urlInput').value.trim();
  const videoId = extractVideoID(url);
  const thumbnail = document.getElementById('videoThumbnail');
  
  if (videoId) {
    thumbnail.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    thumbnail.style.display = 'block';
  } else {
    thumbnail.src = '';
    thumbnail.style.display = 'none';
  }
}