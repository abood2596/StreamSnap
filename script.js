const apiUrl = "https://streamsnap-backend.abood.repl.co/download";

document.getElementById("downloadBtn").addEventListener("click", async () => {
  const url = document.getElementById("urlInput").value;
  const format = document.getElementById("formatSelect").value;
  const quality = document.getElementById("qualitySelect").value;

  if (!url) {
    alert("Please enter a video URL.");
    return;
  }

  document.getElementById("statusBar").textContent = "Processing...";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url, format, quality })
    });

    if (!response.ok) {
      throw new Error("Download failed.");
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `video.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    document.getElementById("statusBar").textContent = "Download complete!";
  } catch (error) {
    document.getElementById("statusBar").textContent = "Error: " + error.message;
  }
});