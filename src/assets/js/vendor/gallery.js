import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery',
  children: 'a',
  bgOpacity: 0.9,
  pswpModule: () => import('/photoswipe/photoswipe.esm.js'),
});
lightbox.on('afterInit', () => {
  const pswp = lightbox.pswp;
  const root = pswp.element;

  const onKeydown = (e) => {
    if (e.key !== 'Tab') return;
    const focusable = root.querySelectorAll(
      'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && (document.activeElement === first || document.activeElement === root)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  root.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (button) button.focus({ preventScroll: true });
  });

  root.addEventListener('keydown', onKeydown);
  pswp.on('destroy', () => root.removeEventListener('keydown', onKeydown));
});
lightbox.init();