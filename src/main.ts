import './base.css';

const root = document.getElementById('app')!;
const mq = window.matchMedia('(orientation: portrait)');

let teardown: (() => void) | null = null;
let current: 'portrait' | 'landscape' | null = null;
let token = 0;   // identifies the latest request, to ignore stale ones

async function switchDesign() {
  const which = mq.matches ? 'portrait' : 'landscape';
  const mine = ++token;
  if (which === current) return;

  const mod = which === 'portrait'
    ? await import('./portrait/main')
    : await import('./landscape/main');

  if (mine !== token) return;   // the window changed shape again while loading

  teardown?.();                 // stop the old design
  root.replaceChildren();       // clear its DOM
  root.removeAttribute('style');
  root.className = which;       // scopes the CSS
  teardown = mod.mount(root);
  current = which;
}

mq.addEventListener('change', switchDesign);
switchDesign();