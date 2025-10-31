const toggleBtn = document.querySelector('.menu-toggle');
const nav = document.getElementById('main-nav');

toggleBtn.addEventListener('click', () => {
  nav.classList.toggle('open');
});




(function () {

  const galleries = document.querySelectorAll('.grid.gallery');
  const allImages = [];
  galleries.forEach(g => {
    const imgs = Array.from(g.querySelectorAll('img'));
    imgs.forEach(img => allImages.push(img));
  });
  if (!allImages.length) return;



  const overlay = document.createElement('div');
  overlay.setAttribute('id', 'lightbox');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <button class="lb-close" aria-label="Close">×</button>
    <button class="lb-prev" aria-label="Previous">‹</button>
    <img class="lb-img" alt="">
    <button class="lb-next" aria-label="Next">›</button>
    <div class="lb-caption" aria-live="polite"></div>
  `;
  document.body.appendChild(overlay);

  const lbImg = overlay.querySelector('.lb-img');
  const lbCap = overlay.querySelector('.lb-caption');
  const btnPrev = overlay.querySelector('.lb-prev');
  const btnNext = overlay.querySelector('.lb-next');
  const btnClose = overlay.querySelector('.lb-close');

  let current = 0;

  function openAt(index) {
    current = index;
    const img = allImages[current];
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt || '';
    lbCap.textContent = img.alt || '';
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function prev() { openAt((current - 1 + allImages.length) % allImages.length); }
  function next() { openAt((current + 1) % allImages.length); }

 


  allImages.forEach((img, i) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openAt(i));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openAt(i);
    });
 


    img.setAttribute('tabindex', '0');
  });



  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);
  overlay.addEventListener('click', (e) => {



    if (e.target === overlay) close();
  });
  window.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
})();
