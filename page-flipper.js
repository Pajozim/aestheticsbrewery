// page flip definitions =================================================================================================

const dynnav = document.getElementById('dynamic-nav');
const pagefliptri = document.getElementById('studio');
const pagefliptr2 = document.getElementById('pftbiS');
const pageflipper = document.getElementById('page-flipper');
const pflayer1 = document.getElementById('layer1');


// flip to Studio ==========================================================================================================

pagefliptri.addEventListener('click', () => {
  // flip pageflipper
  pageflipper.classList.remove('fliptoIS');
  void pageflipper.offsetWidth; // This forces a reflow
  pageflipper.classList.add('fliptoRS');

  // disappear layer1
  pflayer1.classList.remove('reappear');
  pflayer1.classList.add('disappear');

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

  // dynamic composer
  document.addEventListener('DOMContentLoaded', function() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    if (products.length === 0) {uploadProducts();} else {displayProducts();}
  });
});

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
})