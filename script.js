
function startDownload() {
  const url = document.getElementById('urlInput').value.trim();
  const format = document.getElementById('formatSelect').value;
  const quality = document.getElementById('qualitySelect').value;
  const status = document.getElementById('status');
  const progressBar = document.getElementById('progressBar');

  if (!url) {
    status.textContent = "Please enter a YouTube URL.";
    return;
  }

  progressBar.style.width = "0%";
  status.textContent = "Preparing download...";

  fetch('http://localhost:3000/download', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url, format, quality })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to download");
    }
    const total = 100;
    let current = 0;

    const interval = setInterval(() => {
      current += 10;
      if (current > total) current = total;
      progressBar.style.width = current + "%";
    }, 300);

    return response.blob().then(blob => {
      clearInterval(interval);
      progressBar.style.width = "100%";
      status.textContent = "Download ready";

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = format === 'mp3' ? 'audio.mp3' : 'video.mp4';
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  })
  .catch(error => {
    progressBar.style.width = "0%";
    status.textContent = "Error: " + error.message;
  });
}
