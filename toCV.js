// flip to Studio ==========================================================================================================

pagefliptri.addEventListener('click', () => {
  // flip pageflipper
  pageflipper.classList.remove('fliptoIS');
  void pageflipper.offsetWidth; // This forces a reflow
  pageflipper.classList.add('fliptoRS');

  // disappear layer1
  pflayer1.classList.remove('reappear');
  pflayer1.classList.add('disappear');

  // dynamic composer
  pfgridC.classList.remove('disappear');
  setTimeout(() => {pfgridC.classList.add('appear')}, 1000);

  (products.length === 0) ? uploadProducts() : displayProducts();

  // dynamic nav
  dynnav.style.display = 'flex';
  setTimeout(() => {
    dynnav.style.opacity = '0';
  }, 2000);
  setTimeout(() => {
    dynnav.style.display = 'none';
  }, 2500);
  // reappear of dynav bar
  document.addEventListener('keydown', function(event) {
    if (event.key === 'n' && event.type === 'keydown' && pageflipper.classList.contains('fliptoRS')) {
      dynnav.style.display = 'flex';
      dynnav.style.opacity = '1';
      setTimeout(() => {
        dynnav.style.opacity = '0';
      }, 4000);
      setTimeout(() => {
        dynnav.style.display = 'none';
      }, 4500);
    }
  });
})

// back to Initial State / Start Page ==============================================================================

pagefliptr2.addEventListener('click', () => {
  // to the intial state
  pageflipper.classList.remove('fliptoRS');
  void pageflipper.offsetWidth;
  pageflipper.classList.add('fliptoIS');

  // reappear layer1
  setTimeout(() => {
    pflayer1.classList.remove('disappear');
    pflayer1.classList.add('reappear');
  }, 1000);

  // dynamic nav
  setTimeout(() => {
    dynnav.style.opacity = '0';
  }, 300);
  setTimeout(() => {
    dynnav.style.display = 'none';
  }, 800);

  pfgridC.classList.remove('appear');
  pfgridC.classList.add('disappear');
})