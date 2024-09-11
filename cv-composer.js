// Display products ===============================================================================================================

  function displayProducts() {    
    const productList = document.getElementById('grid-container');
    productList.innerHTML = ''; // Clear existing content

    let rootedNo = Math.sqrt(products.length);
    let roundedUpNo = Math.ceil(rootedNo); // next rounded up integer
    let roundedDownNo = Math.floor(rootedNo); // next rounded down integer

    // calclation of the row height
    const rowDivisor = products.length <= roundedUpNo * roundedDownNo ? roundedDownNo : roundedUpNo;

    let rowfactor = (100 / rowDivisor) + 'vh';

    // grid composition
    let initialGrid = `repeat(${roundedUpNo}, 1fr)`;
    productList.style.gridTemplateColumns = initialGrid;
    productList.style.gridAutoRows = rowfactor;

    // Add each product to the grid
    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList = 'candy';
      productElement.id = `c${product.identifier}`;
      productElement.style.backgroundColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      // it works, just easier to work with colors: productElement.innerHTML = `<img src="${product.image}" alt="${product.name}">`;
      productList.appendChild(productElement);
      });
   
    // create a filler
    // 8 products, the row width is incorrect
    if (!Number.isInteger(rootedNo) && products.length !== roundedUpNo * roundedDownNo) {
      let colSubtrahend, colDivisor, fillergridCol;

      if (products.length > roundedUpNo ** 2 || products.length > (roundedUpNo * roundedDownNo)) {
        colSubtrahend = roundedUpNo ** 2;
        colDivisor = roundedUpNo;
      } else {
        colSubtrahend = roundedUpNo * roundedDownNo;
        colDivisor = roundedDownNo;
      }

      let colDifference = colSubtrahend - products.length;
      let colQuotient = 100 / colDivisor;

      let ColProduct = colQuotient * colDifference;

      fillergridCol = (colDifference === 1) ? '' : 'span ' + colDifference;

      const filler = document.createElement('div');
      filler.classList = 'candy';
      filler.id = 'Filler';
      filler.style.width = ColProduct + 'vw';
      filler.style.gridColumn = fillergridCol;
      filler.style.height = rowfactor;
      filler.innerHTML = `<img id="brooder" src="Materials/brooder.webp" onmouseover="this.src='Materials/fut-proj.webp';" onmouseout="this.src='Materials/brooder.webp';" alt="man working before his laptop" style="object-fit: contain">`;
      productList.appendChild(filler);
    }
    }

  // .candy expand and collapse =====================================================================================================

  window.addEventListener('click', function(event) {
    if (event.target.classList.contains('candy')) {
      event.target.classList.toggle('expanded');
      document.getElementById('grid-container').classList.toggle('flexed');
      document.querySelectorAll('.candy').forEach(c => {
        if (c !== event.target) {
          c.classList.toggle('hidden');
        }
      });
    }
    else if (event.target.classList.contains('expanded')) {
      event.target.classList.remove('expanded');
      document.getElementById('grid-container').classList.remove('flexed');
      document.querySelectorAll('.candy').forEach(c => {
        c.classList.remove('hidden');
      });
    }
  });

  // gridCount Up and Down ==========================================================================================================
/*
  document.addEventListener('wheel', function(event) {
    
  let rootedNo = Math.sqrt(products.length);
  let roundedUpNo = Math.ceil(rootedNo); // next rounded up integer

    event.preventDefault = (event.deltaY !== 0);

    const scrollAmount = event.deltaY;
    changeGridComposition();
  });

  document.addEventListener('keydown', function(event) {
    //event.preventDefault();

    if (event.key === 'PageUp' || event.key === 'PageDown') {
      changeGridComposition();
    }
  });

  function changeGridComposition() {
    // mousewheel event
    if (scrollAmount > 0) {
      gridUp();
    } else {
      gridDown();
    }

    // keydown events
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      if (event.key === 'PageUp') {
        gridUp();
      } else {
        gridDown();
      }
    }

    function gridUp() {
      productList.style.gridTemplateColumns = `repeat(${roundedUpNo + 1}, 1fr)`;
      productList.style.gridAutoRows = rowfactor[roundedUpNo];
    }

    function gridDown() {
      productList.style.gridTemplateColumns = `repeat(${roundedUpNo - 1}, 1fr)`;
      productList.style.gridAutoRows = rowfactor[roundedUpNo - 1];
    }
  }

  /* propositions/to dos: 
  + indicating help by pressing 'h' 
  + in the upper left corner a stowaway for exiting
  + an introductory box/div with motion graphics
  
  */