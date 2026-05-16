function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

document.addEventListener("DOMContentLoaded", () => {
  const resumeViewer = document.getElementById("resume-container");
  if (resumeViewer === null) return;

  if (isMobile()) {
    // Mobile: provide a download link
    resumeViewer.innerHTML =
      '<a href="Assets/Resume.pdf" class="text-sky-300 underline" download>Download PDF</a>';
  } else {
    // Desktop: embed iframe preview
    resumeViewer.innerHTML =
      '<iframe src="Assets/Resume.pdf" class="w-full h-[100vh] overflow-hidden" frameborder="1"></iframe>';
  }
});
