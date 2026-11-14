
// <script aria-label="data independent script">


// DOM Elements ==========================================================================================================

const LangEng        = document.getElementById('eng');
const LangDeu        = document.getElementById('deu');
const LangEsp        = document.getElementById('esp');

const pagefliptr     = document.getElementById('pftbiS');

const pfTriStudio    = document.getElementById('studio');
const pfTriCV        = document.getElementById('currvitae');
const pfTriContact   = document.getElementById('contact');

const contactName    = document.getElementById('c-name');
const contactMail    = document.getElementById('c-email');
const contactSubject = document.getElementById('c-subject');
const contactMessage = document.getElementById('c-message');
const contactSubmit  = document.getElementById('c-submit');

// root ==================================================================================================================

const root         = document.documentElement;
const screenwidth  = window.screen.width;
const screenheight = window.screen.height;

// start/landing page definitions ========================================================================================

const pageflipper  = document.querySelector('.page-flipper');
const spcontainer  = document.getElementById('stpg-container');
const dynnav       = document.getElementById('dynamic-nav');

// studio page definitions ===============================================================================================

const studioC      = document.getElementById('studio-container');
const candies      = document.querySelectorAll('.candy');

// cv page definitions ===================================================================================================

const cvcontainer  = document.getElementById('cv-container');
const firstrow     = document.getElementById('firstrow');
const frchildren   = firstrow.children;
const curriculum   = document.getElementById('curriculum');

// contact page definitions ==============================================================================================

const contactcontainer = document.getElementById('contact-page');

// return to SP element ==================================================================================================

const nkeytosp = document.getElementById('nkeytosp');

// system language pool ==================================================================================================

const sysLangPool = ['en', 'de', 'es'];

let curLang = 'en';

let cvLangIndex = (lang = curLang) => {

const langUniformed = lang.toLowerCase();
const slicedLang = langUniformed.length > 2 ? langUniformed.slice(0, 2) : langUniformed;
const langIndex = sysLangPool.indexOf(slicedLang);
return langIndex === -1 ? 0 : langIndex;

};

// colors ================================================================================================================

const COLORPOOL = [
"#2b6838", "#a7a5e7", "#c07739", "#7f559c", "#2da48d", "#8a3d0f", "#7faa5a", "#d1819a", "#20759f", "#7f8833", "#8287a2", "#8c5c68", "#4e566b", "#e49a6b", "#949b84", "#617969", "#5a9fdb", "#883352", "#bfa6ad", "#58c095", "#6d5c3c", "#9b6701", "#a46ca3", "#7574c3", "#315999", "#b89837", "#bd6973", "#2190a5", "#358249", "#264653", "#2A9D8F", "#F4A261", "#E76F51", "#233D4D", "#FE7F2D", "#619B8A", "#A4243B", "#D8973C", "#BD632F", "#273E47", "#585123", "#F58549", "#772F1A", "#8ea604", "#523a34", "#b87d4b", "#9b9b7a", "#797d62", "#d08c60", "#523a34", "#ee4266", "#6a994e", "#004e98", "#f07167", "#df2935", "#ff8c61", "#ce6a85", "#985277", "#5c374c", "#f28482", "#c11405", "#79779a", "#008080", "#778844"
]

let curClrPool = new Set();

const colorRandomizer = () => {
const color = COLORPOOL[Math.random()*COLORPOOL.length | 0];
if (!curClrPool.has(color)) {
    curClrPool.add(color);
    return color;
};
return colorRandomizer();
};

// .candy expand and collapse ============================================================================================

window.addEventListener('click', function(event) {
const ET              = event.target;
const elementToToggle = ET.classList.contains('candy') ? ET : ET.parentElement;
const FillerElement   = ET.id.includes('Filler') || ET.parentElement.id.includes('Filler');

if (!FillerElement && (ET.classList.contains('candy') || ET.parentElement.classList.contains('candy'))) { 
    elementToToggle.classList.toggle('expanded');
    const first = elementToToggle.children[0];
    if (first?.matches("video")) first.toggleAttribute("controls");
    elementToToggle.children[1]?.classList.toggle('hidden');
    studioC.classList.toggle('flexed');
    document.querySelectorAll('.candy').forEach(c => {
    if (c !== ET && c !== ET.parentElement) {
        c.classList.toggle('hidden');
    }
    });
}
});

// alternating row height ================================================================================================

window.addEventListener('click', (event) => {

const currcompr    = document.querySelector('.compressed');
const firosmall    = document.querySelector('.small');

if (event.target === currcompr || event.target === firosmall) {
    
    document.getElementById('firstrow').classList.toggle('compressed');
    document.getElementById('curriculum').classList.toggle('small');
    document.getElementById('curriculum').classList.toggle('enlarged');
    document.getElementById('cv-block-0').classList.toggle('envisage');
    document.getElementById('cv-block-1').classList.toggle('passee1');
    document.getElementById('cv-block-2').classList.toggle('passee2');
    document.getElementById('cv-block-3').classList.toggle('passee3');
    document.getElementById('indicator').classList.toggle('show');
}
});

// curriculum text show ==================================================================================================

function twentyvh() {
    root.style.setProperty('--fontheight', `${window.innerHeight * .1}px`); // Set the font size
}
</script>
// firstrow blocks scalable ==============================================================================================

const firstrowids = ['cv-photo', 'cv-basics', 'cv-education', 'cv-certificates', 'cv-projects', 'cv-skills'];

window.addEventListener('click', (event) => {
if (event.target.classList.contains('triangleBtn')) return;

const parentWithId = event.target.closest('[id]');

if (firstrowids.includes(parentWithId.id) && !parentWithId.classList.contains('compressed') && !parentWithId.parentNode.classList.contains('compressed')) {
    // Toggle the 'ixpanded' class on the parent element with an id
    parentWithId.classList.toggle('ixpanded');
}
});

// resize of textarea ====================================================================================================

contactMessage.addEventListener('input', function() {
this.style.height = 'auto';
this.style.height = this.scrollHeight + 'px';
});

// sending text ==========================================================================================================

function SendMessage() {
const contactName = document.getElementById('c-name');
const contactSubject = document.getElementById('c-subject');
const contactEmail = document.getElementById('c-email');
const Mail = [contactName ? contactName.value : '', contactSubject ? contactSubject.value : '', contactEmail ? contactEmail.value : '', contactMessage ? contactMessage.value : ''];

alert(Mail[0] + ' ' + Mail[1] + ' ' + Mail[2] + ' ' + Mail[3]);

if (Mail[2] === '') {
    alert('Please enter your email.');
} else if (Mail[3] === '') {
    alert('Please enter a message.');
} else {
    alert('Thank you for your message, ' + Mail[0] + '!');
}

const link = encodeURIComponent("mailto:pajozim@gmail.com")
            + "?from=" + encodeURIComponent(Mail[2])
            + "&subject=" + encodeURIComponent(Mail[1])
            + "&body=" + encodeURIComponent(Mail[3]);
            + "&name=" + encodeURIComponent(Mail[0]);
window.location.href = link;
}

// adaptable font-size ===================================================================================================

if (window.screen.width > window.screen.height) {
document.addEventListener('DOMContentLoaded', () => {
    root.style.setProperty('--changfontsize', `${(Math.floor(window.innerWidth / 100) - 2)}px`);
}); 
}

// changing backgrounds ==================================================================================================

// Preload images
/*
const imageUrls = [
'Materials/bg_p0.webp',
'Materials/bg_p1.webp',
'Materials/bg_p2.webp',
'Materials/bg_p3.webp',
'Materials/bg_p4.webp',
];

imageUrls.forEach(url => {
const img = new Image();
img.src = url;
img.onload = function() {
    caches.open('image-cache').then(cache => {
    cache.put(url, new Response(img.src));
    });
};
});

spcontainer.style.backgroundImage = `url('Materials/bg_p0.webp')`;

setInterval(() => {
const rndCol = () => (Math.floor(Math.random() * imageUrls.length));
spcontainer.style.backgroundImage = `url('Materials/bg_p${rndCol()}.webp`;    
}, 30000);
*/