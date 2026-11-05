document.addEventListener("DOMContentLoaded", (event) => {
  const iframes = document.querySelectorAll("iframe");
  if (iframes.length) {
    iframes.forEach((iframe) => {
      resizeIframe(iframe);
      detectPageResize(iframe);
    });
  }
});

function detectPageResize(iframe) {
  window.addEventListener('resize', function(event) {
    resizeIframe(iframe);
  }, true);
}

function resizeIframe(iframe) {
    const iframeWidth = iframe.getBoundingClientRect().width;
    const ratioForWidth = 16;
    const ratioForHeight = 9;
    const ratio  = iframeWidth / ratioForWidth;
    const iframeHeight = ratio * ratioForHeight;
    iframe.style.height = iframeHeight + 'px';
}