
// <script aria-label="data dependent script">

// change landing page colors randomly ===============================================================================

const LPC = [ // Landing Page Colors
  ['#FA8072', '#0F5257', '#482C3D', '#6D1A36', '#4682B4'],
  ['#96897B', '#628395', '#11151C', '#CF995F', '#212D40'],
  ['#896978', '#839791', '#191D32', '#45462A', '#DC851F'],
  ['#4D7EA8', '#272932', '#828489', '#9E90A2', '#F15025'],
]

const randomColorSet = () => LPC[Math.floor(Math.random() * LPC.length)];

const currentColorSet = randomColorSet();

document.documentElement.style.setProperty("--stpgContColor", currentColorSet[0]);
document.documentElement.style.setProperty("--idiomsColor", currentColorSet[1]);
document.documentElement.style.setProperty("--cvColor", currentColorSet[2]);
document.documentElement.style.setProperty("--studioColor", currentColorSet[3]);
document.documentElement.style.setProperty("--contactColor", currentColorSet[4]);

// fetch data ================================================================================

async function fetchAndStoreData(url, localStorageKey) {

  const response = await fetch(url);
  const data = await response.json();

  localStorage.setItem(localStorageKey, JSON.stringify(data));
  
  return data;  // Returning the fetched data
}

async function LoadData() {

  // Fetch and store all data asynchronously
  const result = await Promise.all([
    fetchAndStoreData('../data/cv.json', 'cvData'),
    fetchAndStoreData('../data/products.json', 'productsData'),
    fetchAndStoreData('../data/materials.json', 'materialsData'),
    fetchAndStoreData('../data/languages.json', 'languagesData')
  ]);

  // Store the result in the variables
  cv        = result[0] || null;
  products  = result[1] || null;
  materials = result[2] || null;
  languages = result[3] || null;

  return { cv, products, materials, languages };
}

LoadData()
.then((data) => {
  
  const { cv, products, materials, languages } = data;

  // LANGUAGE +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // set system language
    curLang              = navigator.language || navigator.userLanguage;
    let initialLangIndex = cvLangIndex(curLang);

    // cvBlocks
    let cvBlocks         = cv[initialLangIndex]?.resume || {};
    
    // function for setting/switching language
    function setLanguage(index) {
      try {
        const chosenLang       = languages[index];
 
        pagefliptr.textContent = chosenLang?.contNavBar;
          
        [contactName, contactMail, contactSubject, contactMessage].forEach((el, i) => {
          el.placeholder = chosenLang?.contContact[i]?? '';
        });
        contactSubmit.textContent = chosenLang?.contContact[4] || 'Send';

        [pfTriCV, pfTriStudio, pfTriContact].forEach((el, i) => {
          el.textContent = chosenLang?.contSP[i]?? '';
        }); 
      }
      catch (error) {
        console.error("Error loading language data:", error);
        alert("There was an issue loading the language data. Please try again or later.");
      }

      return languageIndex = index;
    }

    // set Language
    setLanguage(initialLangIndex);
    
    // switch Language
    [LangEng, LangDeu, LangEsp].forEach((el, i) => el.addEventListener('click', () => {
      curLang = el.id.slice(0, 2);
      setLanguage(i);
      displayCV(cvLangIndex(curLang), true);
    }));

  // STARTPAGE COMPOSITION ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // triangle Button element =================================================================================================
    const triangleBtn = document.querySelector('.triangleBtn');

    triangleBtn.addEventListener('click', () => {
      if (pageflipper.classList.contains('ftoSS')) {
        backToSPFromStudio();
      }
      else if (pageflipper.classList.contains('ftoCS')) {
        backToSPFromCV();
      }
      else if (pageflipper.classList.contains('ftoCo')) {
        backToSPFromContact();
      }
    })

    // dynamic navigation bar ==================================================================================================
    window.addEventListener('keydown', function(event) {
      const dnIntro = dynnav.classList.contains('dn-intro');

      if (event.key === 'n' && event.type === 'keydown' && pageflipper.classList.contains('ftoSS')) {
        backToSPFromStudio();
      }
      else if (event.key === 'n' && event.type === 'keydown' && pageflipper.classList.contains('ftoCS')) {
        backToSPFromCV();
      }
      else if (event.key === 'n' && event.type === 'keydown' && pageflipper.classList.contains('ftoCo')) {
        backToSPFromContact();
      }
    });

    // nkey to SP
    nkeytosp.src = materials[4]?.src || '';
    nkeytosp.alt = materials[4]?.name || '';

  // STUDIO COMPOSER ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // Display products
    function displayProducts() {

      if (studioC.innerHTML !== '') return;

      studioC.innerHTML = ''; // Clear existing content

      let rootedNo          = Math.sqrt(products.length);
      let roundedUpNo       = Math.ceil(rootedNo); // next rounded up integer
      let roundedDownNo     = Math.floor(rootedNo); // next rounded down integer

      // calculation of the row height
      const rowDivisor      = products.length <= roundedUpNo * roundedDownNo ? roundedDownNo : roundedUpNo;

      let rowfactor = (100 / rowDivisor) + 'vh';

      // grid composition
      let initialGrid = `repeat(${roundedUpNo}, 1fr)`;
      studioC.style.gridTemplateColumns = initialGrid;
      studioC.style.gridAutoRows = rowfactor;

      // dynamically mapped product categories colors
      const CATCOLORS = new Map([
        ["artcrafts", colorRandomizer()],
        ["digitaldesign", colorRandomizer()],
        ["printdesign", colorRandomizer()],
        ["webdesign", colorRandomizer()],
        ["programming", colorRandomizer()]
      ])

      // Add each product to the grid
      products.forEach(product => {
        const productElement                 = document.createElement('div');
        productElement.classList             = 'candy ' + product.extraclass.join(' ');
        productElement.style.backgroundColor = CATCOLORS.get(product.extraclass[0]);
        productElement.id                    = `c${products.indexOf(product) + 1}`;
        productElement.innerHTML             = `<${product.mediaType} src="${product.src}" alt="${product.name}" ${product.mediaType === 'video' ? 'autoplay loop muted' : ''}>`;
        productElement.innerHTML             += product.extraComponent ?? '';
        studioC.appendChild(productElement);
      });
      
      // create a filler
      const oneofboth = [materials[2]?.src || '' , materials[3]?.src || '']; // change workingon img on every reload
      const curWOimg  = oneofboth[Math.floor(Math.random() * oneofboth.length)];
      const FPimg     = materials[1]?.src || ''; // FP = furture projects
      if (!Number.isInteger(rootedNo) && products.length !== roundedUpNo * roundedDownNo) {
        let colSubtrahend, colDivisor, fillergridCol;

        if (products.length > roundedUpNo ** 2 || products.length > (roundedUpNo * roundedDownNo)) {
          colSubtrahend          = roundedUpNo ** 2;
          colDivisor             = roundedUpNo;
        } else {
          colSubtrahend          = roundedUpNo * roundedDownNo;
          colDivisor             = roundedDownNo;
        }

        let colDifference        = colSubtrahend - products.length;
        let colQuotient          = 100 / colDivisor;

        let ColProduct           = colQuotient * colDifference;

        fillergridCol            = (colDifference === 1) ? '' : 'span ' + colDifference;

        const filler             = document.createElement('div');
        filler.classList         = 'candy';
        filler.id                = 'Filler';
        filler.style.gridColumn  = fillergridCol;
        filler.innerHTML         = `<img id="workingon" src="${curWOimg}" onmouseover="this.src='${FPimg}'" onmouseout="this.src='${curWOimg}'" alt="image depicting the concept of working on">`;
        studioC.appendChild(filler);
  }
    }

    // swiping to left or right in Studio 
    function classjuggler(p) {
      p.classList.toggle('hidden');
      p.classList.toggle('expanded');
      const first = p.children[0];
      if (first?.matches("video")) first.toggleAttribute("controls");
      p.children[1]?.classList.toggle('hidden');
    }

    window.addEventListener('wheel', function(event) {
      const NoStudioContainer = event.target.id.includes('studio-container');
      const elementToChange   = event.target.classList.contains('expanded') ? event.target : event.target.parentElement;
      const showwebElement    = elementToChange.classList.contains('showweb') ? true : false;

      //left swipe
        if (event.deltaY > 0 && elementToChange.classList.contains('expanded') && !showwebElement && !NoStudioContainer) {
        classjuggler(elementToChange);
        const prodIndNewId = Number(elementToChange.id.slice(1)) + 1;
        if (prodIndNewId > products.length) {
          const prodIndNew = document.getElementById(`c1`);
          classjuggler(prodIndNew);
        } else {
          const prodIndNew = document.getElementById(`c${prodIndNewId}`);
          classjuggler(prodIndNew)
        }
      }
      //right swipe
      else if (event.deltaY < 0 && elementToChange.classList.contains('expanded') && !showwebElement && !NoStudioContainer) {
        classjuggler(elementToChange);
        const prodIndNewId = Number(elementToChange.id.slice(1)) - 1;
        if (prodIndNewId <= 0) {
          const prodIndNew = document.getElementById(`c${products.length}`);
          classjuggler(prodIndNew)
        } else {
          const prodIndNew = document.getElementById(`c${prodIndNewId}`);
          classjuggler(prodIndNew)
        }
      }

      else if (event.deltaY > 0 && showwebElement) {
        window.scrollBy(0, 500);    
      }

      else if (event.deltaY < 0 && showwebElement) {
        window.scrollBy(0, -500);
      }
    });

    window.addEventListener('keydown', function(event) {
      const prodIndOld = document.querySelector('.expanded'); // Assuming only one element is expanded at a time
      // Left swipe 
      if (event.key === 'ArrowLeft' && event.type === 'keydown') {
        // Find the currently expanded element
        if (prodIndOld) {
          classjuggler(prodIndOld);
          const prodIndNewId = Number(prodIndOld.id.slice(1)) - 1;
          if (prodIndNewId <= 0) {
            const prodIndNew = document.getElementById(`c${products.length}`);
            classjuggler(prodIndNew)
          } else {
            const prodIndNew = document.getElementById(`c${prodIndNewId}`);
            classjuggler(prodIndNew)
          }
        }
      }
      //right swipe
      else if (event.key === 'ArrowRight' && event.type === 'keydown') {
        if (prodIndOld) {
          classjuggler(prodIndOld);
          const prodIndNewId = Number(prodIndOld.id.slice(1)) + 1; // Get the new product ID
          if (prodIndNewId > products.length) {
            // Wrap around to the first product if the new ID exceeds the total number of products
            const prodIndNew = document.getElementById('c1');
            classjuggler(prodIndNew);
          } else {
            // Move to the next product element
            const prodIndNew = document.getElementById(`c${prodIndNewId}`);
            classjuggler(prodIndNew);
          }
        }
      }
    });

  // CV COMPOSER ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // Display cv steps 
    function displayCV(langIdx, langChanged = false) {

      if (firstrow.innerHTML !== '' && curriculum.innerHTML !== '' && !langChanged) return;

      curClrPool = new Set(); // reset the distinct colors picked

      cvBlocks             = cv[langIdx]?.resume || {};

      // storing the states of the cv-blocks
      const currentClassList = {
        "futur3": document.querySelector('.futur3')?.id || '', 
        "futur2": document.querySelector('.futur2')?.id || '', 
        "futur1": document.querySelector('.futur1')?.id || '', 
        "futur0": document.querySelector('.futur0')?.id || '', 
        "envisage": document.querySelector('.envisage')?.id || '', 
        "passee0": document.querySelector('.passee0')?.id || '', 
        "passee1": document.querySelector('.passee1')?.id || '', 
        "passee2": document.querySelector('.passee2')?.id || '', 
        "passee3": document.querySelector('.passee3')?.id || ''
        };

      firstrow.innerHTML   = '';
      curriculum.innerHTML = '';

      const CVTITLES = {
        "education": {
          "en": "Education",
          "es": "Educación",
          "de": "Bildung"
        },
        "certificates": {
          "en": "Certificates",
          "es": "Certificados",
          "de": "Zertifikate"
        },
        "projects": {
         "en" : "Projects",
         "es" : "Proyectos",
         "de" : "Projekte"
        },
        "skills": {
          "en": "Skills",
          "es": "Habilidades",
          "de": "Fertigkeiten"
        }
      }

      curLang = curLang.length > 2 ? curLang.slice(0, 2) : curLang;

      const SECTIONS = [
        ["photo", v => `<img src="${v.image}" alt="${v.name}">`],
        ["basics",  (v) => {
          const BASICSKIP = new Set(["image", "summary", "url", "name"]);
          let html = `<h3>${v.name}</h3>`;
          for (const [key, value] of Object.entries(v)) {
            if (BASICSKIP.has(key)) continue;
            else if (key === "location") html += `<p>${value.city}</p>`
            else if (key === "profiles") html += `${value.map(p => `<p>${p.network}&nbsp;&nbsp;&nbsp;<a href="${p.url}" target="_blank" class="cv-link"><img src="Materials/link.svg"></a></p>`).join("")}`
            else html += `<p>${value}</p>`
          }
          return html;
        }],
        ["education", v => `<h3>${CVTITLES["education"][curLang]}</h3>${v.map(e=>`<p><em>${e.startDate} — ${e.endDate}</em><br>${e.area} in ${e.institution} (${e.location.split(", ")[1]})`).join("</p>")}`],
        ["certificates", v => `<h3>${CVTITLES["certificates"][curLang]}</h3>${v.map(e=>`<p>${e.name}&nbsp;&nbsp;&nbsp;${e.url ? `<a href="${e.url}" target="_blank" class="cv-link"><img src="Materials/link.svg"></a>` : ""}`).join("</p>")}`],
        ["projects", v => `<h3>${CVTITLES["projects"][curLang]}</h3>${v.map(e=>`<p>${e.name}&nbsp;&nbsp;&nbsp;<a href="${e.link}" target="_blank" class="cv-link"><img src="Materials/link.svg"></a></p>`).join("")}`],
        ["skills", v => `<h3>${CVTITLES["skills"][curLang]}</h3>${v.map(e=>`<p><em>${e.name}</em>:<br>${e.keywords.join(", ")}`).join("</p>")}`],
        ["work", (v) => v.map((item, i) =>
          `<div id="cv-block-${i}" class="${langChanged ? 'hidden' : ''}" style="background:${colorRandomizer()}">
            <h3>${item.name}</h3>
            <p>&nbsp;${item.location}</p>
            <p><em>${item.startDate} - ${item.endDate}</em></p>
            <p>${item.position}<br>
            ${item.highlights ? `<ul><li>${item.highlights.join("</li><li>")}</li></ul>` : ""}
          </p></div>`
        ).join("")],
      ];

      const WORK = new Set(["work"]);
      const EXCWORK = new Set(["photo", "basics", "education", "certificates", "projects", "skills"]); // all the keys except "work"

      function renderCV(data, el, filterSet) {
        el.innerHTML = SECTIONS
          .filter(([k]) => filterSet.has(k))
          .map(([k, fn]) => {
            if (k === 'photo') return `<div id="cv-${k}">${fn(data["basics"])}</div>`
            else if (k === 'work') return `${fn(data[k])}`
            else return `<div id="cv-${k}" style="background-color: ${colorRandomizer()}">${fn(data[k])}</div>`
          })
          .join("");
      }

      renderCV(cvBlocks, firstrow, EXCWORK);
      renderCV(cvBlocks, curriculum, WORK);

      if (currentClassList["envisage"]) {
        for (const [k, v] of Object.entries(currentClassList)) {
            const processedElement = document.getElementById(v);
            if (!processedElement) continue;
            processedElement.classList.remove("hidden");
            processedElement.classList.add(k);  
        }      
      }
    }

    // defining current length/quantity of blocks in cvBlocks
    const curBlklength = cvBlocks["work"].length || 0;

    // initial curriculum block count indicator
    const countindicator     = document.getElementById('indicator');
    countindicator.innerHTML = `<span id="currentblock">1</span>&nbsp;of&nbsp;<span id="totalbcount"> ${curBlklength || 0} </span>`;

    // wheeling/swiping through curriculum blocks 
    let cvenvisage, cvNr, cvNrm3, cvNrm2, cvNrm1, cvNr0, cvNrp1, cvNrp2, cvNrp3;

    function cvdeclarations() {
      cvenvisage = document.querySelector('.envisage'),
      cvNr    = Number(cvenvisage.id.split('-')[2]),
      cvNrm3  = document.getElementById(`cv-block-${cvNr - 3}`),
      cvNrm2  = document.getElementById(`cv-block-${cvNr - 2}`),
      cvNrm1  = document.getElementById(`cv-block-${cvNr - 1}`),
      cvNr0   = document.getElementById(`cv-block-${cvNr}`),
      cvNrp1  = document.getElementById(`cv-block-${cvNr + 1}`),
      cvNrp2  = document.getElementById(`cv-block-${cvNr + 2}`),
      cvNrp3  = document.getElementById(`cv-block-${cvNr + 3}`);
    }

    window.addEventListener('wheel', function(event) {
      if (!curriculum.classList.contains('enlarged')) return;

      cvdeclarations();
      const currentblock = document.getElementById('currentblock');

      if (event.deltaY > 0 && cvNr < curBlklength - 1) {
        SwipeToLeft(cvNr, cvNrm3, cvNrm2, cvNrm1, cvNr0, cvNrp1, cvNrp2, cvNrp3);
        currentblock.innerHTML = `${cvNr+2}`;
      } else if (event.deltaY < 0 && cvNr > 0) {
        SwipeToRight(cvNr, cvNrm3, cvNrm2, cvNrm1, cvNr0, cvNrp1, cvNrp2, cvNrp3);
        currentblock.innerHTML = `${cvNr}`;
      }
    });

    window.addEventListener('keydown', function(event) {
      if (!curriculum.classList.contains('enlarged')) return;

      cvdeclarations();
      const currentblock = document.getElementById('currentblock');

      // Left swipe 
      if (event.key === 'ArrowLeft' && event.type === 'keydown' && cvNr > 0) {
        SwipeToRight(cvNr, cvNrm3, cvNrm2, cvNrm1, cvNr0, cvNrp1, cvNrp2, cvNrp3);
        currentblock.innerHTML = `${cvNr}`;
      }
      //right swipe
      else if (event.key === 'ArrowRight' && event.type === 'keydown' && cvNr < curBlklength - 1) {
        SwipeToLeft(cvNr, cvNrm3, cvNrm2, cvNrm1, cvNr0, cvNrp1, cvNrp2, cvNrp3);
        currentblock.innerHTML = `${cvNr+2}`;
      }
    });

    window.addEventListener('click', (event) => {
      const ET = event.target;
      
      //if (!curriculum.classList.contains('enlarged') || ET.classList.contains('triangleBtn') || ET.id.includes('currvitae')) return;
      if (ET.parentElement.classList.contains('enlarged')) {

        cvdeclarations();
        let parentid   = ET.closest('[id]'),
        hascvblock     = parentid.id.startsWith('cv-block'),
        whichidNr      = Number(parentid.id.split('-')[2]),
        whichEnvge     = document.querySelector('.envisage'),
        envgeidNr      = Number(whichEnvge.id.split('-')[2]);

        if ((ET === parentid || hascvblock) && whichidNr > envgeidNr) {
          SwipeToLeft(cvNr, cvNrm3, cvNrm2, cvNrm1, cvNr0, cvNrp1, cvNrp2, cvNrp3);
          currentblock.innerHTML = `${cvNr+2}`;
        }
        else if ((ET === parentid || hascvblock) && whichidNr < envgeidNr) {
          SwipeToRight(cvNr, cvNrm3, cvNrm2, cvNrm1, cvNr0, cvNrp1, cvNrp2, cvNrp3);
          currentblock.innerHTML = `${cvNr}`;
        }
      }
    });

    function SwipeToLeft(cvNr, cvNrm3, cvNrm2, cvNrm1, cvNr0, cvNrp1, cvNrp2, cvNrp3) {

      if (cvNr > 2) {
        cvNrm3.classList.remove('futur0', 'futur1', 'futur2', 'futur3');
        cvNrm3.classList.add('hidden');
      }
      if (cvNr > 1) {
        cvNrm2.classList.remove('futur0', 'futur1', 'futur2', 'futur3');
        if (cvNr === curBlklength - 2) cvNrm2.classList.add('futur3'); // one step before end of line
        else cvNrm2.classList.add('hidden');
      }
      if (cvNr > 0) {
        cvNrm1.classList.remove('futur0', 'futur1', 'futur2', 'futur3');
        if (cvNr === curBlklength - 3 || cvNr === curBlklength - 2) cvNrm1.classList.add('futur2'); //two/one step(s) before end of line
        else cvNrm1.classList.add('hidden');
      }
      
      cvNr0.classList.remove('envisage');
      if (cvNr === curBlklength - 3 || cvNr === curBlklength - 2) cvNr0.classList.add('futur1'); // two/one step(s) before end of line
      else cvNr0.classList.add('futur0');
      
      if (cvNr < curBlklength - 1) {
        cvNrp1.classList.remove('passee0', 'passee1', 'passee2', 'passee3', 'hidden');
        cvNrp1.classList.add('envisage');
      }
      if (cvNr < curBlklength - 2) {
        cvNrp2.classList.remove('passee0', 'passee1', 'passee2', 'passee3', 'hidden');
        if (cvNr === curBlklength - 3) cvNrp2.classList.add('passee0'); //two steps before end of line
        else cvNrp2.classList.add('passee1');
      }
      if (cvNr < curBlklength - 3) {
        cvNrp3.classList.remove('passee0', 'passee1', 'passee2', 'passee3', 'hidden');
        cvNrp3.classList.add('passee2');
      }
    }

    function SwipeToRight(cvNr, cvNrm3, cvNrm2, cvNrm1, cvNr0, cvNrp1, cvNrp2, cvNrp3) {

      if (cvNr > 2) {
        cvNrm3.classList.remove('futur0', 'futur1', 'futur2', 'futur3', 'hidden');
        cvNrm3.classList.add('futur2');
      }
      if (cvNr > 1) {
        cvNrm2.classList.remove('futur0', 'futur1', 'futur2', 'futur3', 'hidden');
        if (cvNr === 2) cvNrm2.classList.add('futur0'); // one step before starting point
        else cvNrm2.classList.add('futur1');
      }
      if (cvNr > 0) {
      cvNrm1.classList.remove('futur0', 'futur1', 'futur2', 'futur3');
      cvNrm1.classList.add('envisage');
      }

      cvNr0.classList.remove('envisage');
      if (cvNr === 2 || cvNr === 1) cvNr0.classList.add('passee1'); // one/two step(s) before starting point
      else cvNr0.classList.add('passee0');

      if (cvNr < curBlklength - 1) {
        cvNrp1.classList.remove('passee0', 'passee1', 'passee2', 'passee3');
        if (cvNr === 2 || cvNr === 1) cvNrp1.classList.add('passee2'); // one/two step(s) before starting point
        else cvNrp1.classList.add('hidden');
      }
      if (cvNr < curBlklength - 2) {
        cvNrp2.classList.remove('passee0', 'passee1', 'passee2', 'passee3');
        if (cvNr === 1) cvNrp2.classList.add('passee3'); // one step before starting point
        else cvNrp2.classList.add('hidden');
      }
      if (cvNr < curBlklength - 3) {
        cvNrp3.classList.remove('passee0', 'passee1', 'passee2', 'passee3');
        cvNrp3.classList.add('hidden');
      }
      
    }

  // TO STUDIO MECHANICS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // flip to Studio 
    pfTriStudio.addEventListener('click', () => {
      // Flip pageflipper
      void pageflipper.offsetWidth; // This forces a reflow
      pageflipper.classList.add('ftoSS');

      // Disappear stpg-container
      spcontainer.classList.remove('appear');
      spcontainer.classList.add('disappear');

      // Flicker of return-to-startpage button
      triangleBtn.classList.replace('SP', 'Studio');

      // Dynamic composer
      studioC.classList.remove('disappear');
      setTimeout(() => {studioC.classList.add('appear')}, 1000);

      // products composition
      displayProducts()

      // Appearance and disappearance of dynav bar
      dynnav.classList.add('dn-intro');
      setTimeout(() => {
        dynnav.classList.remove('dn-intro');
      }, 6000);
    });

    // flip back to Initial State / Start Page
    function backToSPFromStudio() {
      // to the intial state
      if (pageflipper.classList.contains('ftoSS')) {
        pageflipper.classList.remove('ftoSS');
        void pageflipper.offsetWidth;
        pageflipper.classList.add('ftoISfSS');
        setTimeout(() => {
          pageflipper.classList.remove('ftoISfSS');
        }, 1000);
      }

      // appear stpg-container
      setTimeout(() => {
        spcontainer.classList.remove('disappear');
        spcontainer.classList.add('appear');
      }, 1000);

      // removal of return-to-startpage button
      triangleBtn.classList.replace('Studio', 'SP');

      // disappearance of studio
      studioC.classList.remove('appear', 'flexed');
      studioC.classList.add('disappear');
      studioC.innerHTML = '';
    };

    pagefliptr.addEventListener('click', () => {
      backToSPFromStudio();
    });

  // TO CV MECHANICS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // flip to Curriculum 
    pfTriCV.addEventListener('click', () => {
      // flip pageflipper
      void pageflipper.offsetWidth; // This forces a reflow
      pageflipper.classList.add('ftoCS');

      // disappear stpg-container
      spcontainer.classList.remove('appear');
      spcontainer.classList.add('disappear');

      // flicker of return-to-startpage button
      triangleBtn.classList.replace('SP', 'CV');

      // dynamic composer
      cvcontainer.classList.remove('disappear');
      setTimeout(() => {cvcontainer.classList.add('appear')}, 1000);

      // dynamic cv composer
      displayCV(cvLangIndex(curLang));

      // text size
      twentyvh();

      // appearance and disappearance of dynav bar
      dynnav.classList.add('dn-intro');
      setTimeout(() => {
        dynnav.classList.remove('dn-intro');
      }, 6000);
    });

    // flip back to Initial State / Start Page 
    function backToSPFromCV() {
      // to the intial state
      if (pageflipper.classList.contains('ftoCS')) {
        pageflipper.classList.remove('ftoCS');
        void pageflipper.offsetWidth;
        pageflipper.classList.add('ftoISfCS');
        setTimeout(() => {
          pageflipper.classList.remove('ftoISfCS');
        }, 1000);
      }

      // dynamic composer disappearance
      cvcontainer.classList.remove('appear');
      setTimeout(() => {cvcontainer.classList.add('disappear')}, 1000);

      // removal of return-to-startpage button
      triangleBtn.classList.replace('CV', 'SP');

      // appear stpg-container
      setTimeout(() => {
        spcontainer.classList.remove('disappear');
        spcontainer.classList.add('appear');
      }, 1000);
    };

    pagefliptr.addEventListener('click', () => {
        backToSPFromCV();
    });

  // TO CONTACT MECHANICS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // flip to Contact
    pfTriContact.addEventListener('click', () => {
      // flip pageflipper
      void pageflipper.offsetWidth; // This forces a reflow
      pageflipper.classList.add('ftoCo');

      // disappear stpg-container
      spcontainer.classList.remove('appear');
      spcontainer.classList.add('disappear');

      // flicker of return-to-startpage button
      triangleBtn.classList.replace('SP', 'Contact');

      // contact box
      setTimeout(() => {
        contactcontainer.classList.add('on');
      }, 1000);

      // appearance and disappearance of dynav bar
      dynnav.classList.add('dn-intro');
      setTimeout(() => {
        dynnav.classList.remove('dn-intro');
      }, 4000);
    });

    // flip back to Initial State / Start Page ==============================================================================
    function backToSPFromContact() {
      // to the intial state
      if (pageflipper.classList.contains('ftoCo')) {
        pageflipper.classList.remove('ftoCo');
        void pageflipper.offsetWidth;
        pageflipper.classList.add('ftoISfCo');
        setTimeout(() => {
          pageflipper.classList.remove('ftoISfCo');
        }, 1000);
      }

      // removal of return-to-startpage button
      triangleBtn.classList.replace('Contact', 'SP');

      // contact box disappearance
      contactcontainer.classList.remove('on');

      // appear stpg-container
      setTimeout(() => {
        spcontainer.classList.remove('disappear');
        spcontainer.classList.add('appear');
      }, 1000);

      // disappearance of dynamic navigation bar
      dynnav.classList.remove('nkey2', 'nkey1');
    }

    pagefliptr.addEventListener('click', () => {
      backToSPFromContact();
    });

  // END ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

})
.catch((error) => {
    console.error('Error loading data:', error);
});
