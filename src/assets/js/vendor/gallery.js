

const gallery = document.getElementById('gallery');
import { trapFocusInDialog } from '/assets/js/trap-dialog-focus.js';

if (gallery) {
  const base = gallery.dataset.base || '/';
  const { default: PhotoSwipeLightbox } = await import(`${base}photoswipe/photoswipe-lightbox.esm.js`);

  const lightbox = new PhotoSwipeLightbox({
    gallery: '#gallery',
    children: 'a',
    bgOpacity: 0.9,
    pswpModule: () => import(`${base}photoswipe/photoswipe.esm.js`)
  });
  lightbox.on('afterInit', () => {
    const pswp = lightbox.pswp;
    const root = pswp.element;

    trapFocusInDialog(root);
    
    root.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (button) button.focus({ preventScroll: true });
    });

  });
  lightbox.init();
}