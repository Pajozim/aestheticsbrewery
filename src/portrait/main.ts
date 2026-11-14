import './p_styles.css';

const labels = ['english', 'deutsch', 'español', 'curriculum', 'studio', 'contact'];
const colorVars = ['--engColor', '--deuColor', '--espColor', '--cvColor', '--studioColor', '--contactColor', '--globalBGColor'];
const videos: (string | null)[] = ['/videos/eng.webm', '/videos/deu.webm',  '/videos/esp.webm', '/videos/cv.webm', '/videos/studio.webm', '/videos/contact.webm', '/videos/global.webm',];

export function mount(root: HTMLElement): () => void {
  const ac = new AbortController();
  const { signal } = ac;
  let raf = 0;

  // DOM ============================================================================================================================================
  const items = labels.map(label => {
    const button = document.createElement('button');
    button.id = label;
    button.className = 'item';
    button.textContent = label;
    root.appendChild(button);
    return button;
  });

  // constants ======================================================================================================================================
  const itemsCount  = items.length;
  const colorsCount = colorVars.length;

  // state ==========================================================================================================================================
  let pos       = 0, vel = 0, snapDir = 0, lastWheel = 0, lastMove = 0;
  let wheelPos  = 0.44;
  let running   = false,  dragging = false, didDrag = false;
  let lastTime  = performance.now();
  let axis: 'x' | 'y' | null = null;
  let startX    = 0, startY = 0, lastX = 0, lastY = 0;

  const wrap    = (i: number, count: number = colorsCount) => ((i % count) + count) % count;

  // video element ==================================================================================================================================
  const video = document.createElement('video');
  video.className = 'idle-video';
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'none';
  root.appendChild(video);

  // colors =========================================================================================================================================
  function blend() {
    const i0 = Math.floor(pos);
    root.style.setProperty('--from', `var(${colorVars[wrap(i0)]})`);
    root.style.setProperty('--to', `var(${colorVars[wrap(i0 + 1)]})`);
    root.style.setProperty('--t', String(pos - i0));
  }

  // layout =========================================================================================================================================
  function layout() {

    const antePos = wrap(pos - 1);
    pos           = wrap(pos);
    const postPos = wrap(pos + 1);
    const clickableRange: (number | null)[] = [
      antePos === itemsCount ? null : antePos, 
      pos === itemsCount ? null : pos, 
      postPos === itemsCount ? null : postPos
    ];

    const w = window.innerWidth;
    const h = window.innerHeight;
    const m = Math.min(w, h);

    const cx = w * wheelPos;
    const cy = h * 0.76;
    const R = m * 0.30;
    const S = m * -0.14;
    const step = (Math.PI * 2) / (itemsCount + 1);

    items.forEach((el, i) => {
      const a = (i - pos) * step;
      const depth = Math.cos(a);

      const x = cx + (1 - depth) * S;
      const y = cy + Math.sin(a) * R;
      const scale = 0.85 + 0.30 * depth;
      const opacity = 0.55 + 0.45 * (depth + 1) / 2;

      el.style.transform =
        `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`;
      el.style.opacity = String(opacity);
      el.style.zIndex = String(Math.round((depth + 1) * 50));
      el.inert = !clickableRange.includes(i);
      el.classList.toggle('front', clickableRange.includes(i));
    });
    blend();
  }

  //the loop: coast, then settle, then stop =========================================================================================================
  
  // Starts the loop, but only if it isn't already running.
  function wake() {
    if (running) return;                // a loop is already going: don't start a second one
    running = true;                     // mark the loop as active
    lastTime = performance.now();       // reset the clock, so the first dt isn't "time since the last loop ended"
    raf = requestAnimationFrame(tick);  // ask the browser to call tick() before the next repaint; keep the id for cleanup
  }

  // The browser calls this once per frame (about 60x per second). `now` is a timestamp in ms.
  function tick(now: number) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);    // seconds since the last frame, capped at 50ms so a lag spike can't teleport the wheel
    lastTime = now;                                        // remember this frame's time for the next one

    if (!dragging && now - lastWheel > 150) {              // act only when hands are off: no drag, and no mouse-wheel event for 150ms
      let settled = false;                                
      if (Math.abs(vel) > 0.3) {                           // still fast (over 0.3 items/second): coast
        pos += vel * dt;                                   // distance = speed × time
        vel *= Math.pow(0.04, dt);                         // friction: speed drops to 4% per second, scaled by frame time
        //snapDir = Math.sign(vel);                        // remember the direction (+1 or -1) for the snap bias
      } else {                                             // slow enough: settle onto a slot
        vel = 0;                                           // kill the leftover crawl
        const target = Math.round(pos + snapDir * 0.25);   // nearest whole slot, nudged 0.25 in the travel direction so a small push advances instead of falling back
        const diff = target - pos;                         // distance still to go
        //if (Math.abs(diff) < 0.0005) {                   // close enough to count as arrived
        //  pos = target;                                  // land exactly on the slot
        //  layout();                                      // draw that final position
        //  running = false;                               // mark the loop as stopped, so wake() can restart it
        //  return;                                        // leave without scheduling a frame: the loop ends here
        //}
        //pos += diff * (1 - Math.pow(0.001, dt));         // ease: cover a fraction of the remaining distance each frame
        settled = Math.abs(diff) < 0.0005;                 // close enough to count as arrived
        pos = settled ? target : pos + diff * (1 - Math.pow(0.001, dt)); // ease: cover a fraction of the remaining distance each frame
      }
      layout();                                            // redraw the items at the new pos
    }
    raf = requestAnimationFrame(tick);                     // schedule the next frame (also while waiting out the wheel's 150ms)
  }

  // input (every listener carries the signal) ======================================================================================================
  window.addEventListener('resize', layout, { signal });

  window.addEventListener('wheel', e => {
    idling.cancel();
    e.preventDefault();
    const dy = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY;
    pos += dy * 0.003;
    snapDir = Math.sign(dy);
    vel = 0;
    lastWheel = performance.now();
    layout();
    wake();
    idling.start();
  }, { passive: false, signal });

  window.addEventListener('pointerdown', e => {
    didDrag = false;
    dragging = true;
    axis = null;
    vel = 0;
    lastMove = performance.now();
    startX = lastX = e.clientX;
    startY = lastY = e.clientY;
    idling.cancel();
  }, { signal });

  window.addEventListener('pointermove', e => {
    if (!dragging) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    if (axis === null) {
      const totalX = Math.abs(e.clientX - startX);
      const totalY = Math.abs(e.clientY - startY);
      if (Math.max(totalX, totalY) < 8) return;
      axis = totalX > totalY ? 'x' : 'y';
    }

    if (axis === 'y') {
      const now = performance.now();
      const dtMove = Math.max(now - lastMove, 1) / 1000;
      lastMove = now;
      const d = -dy / 150;
      pos += d;
      snapDir = Math.sign(d) || snapDir;
      vel = vel * 0.5 + (d / dtMove) * 0.5;
    } else {
      wheelPos += dx / window.innerWidth;
      wheelPos = Math.min(0.85, Math.max(0.15, wheelPos));
      didDrag = true;
    }
    layout();
  }, { signal });

  window.addEventListener('pointerup', () => {
    if (didDrag) return;

    dragging = false;
    if (performance.now() - lastMove > 80) vel = 0;
    wake();
    idling.start();
  }, { signal });

  window.addEventListener('pointercancel', () => {
    if (didDrag) return;

    dragging = false;
    wake();
    idling.start();
  }, { signal });

  // inactivity states ==============================================================================================================================

  const idling = {
    timeoutID: 0,
    fadeID: 0,
    active: false,

    start() {
      clearTimeout(this.timeoutID);
      this.timeoutID = window.setTimeout(() => {
        if (dragging || running) { this.start(); return; }

        const index = wrap(Math.round(pos));
        const url = videos[index];
        if (!url) return;

        if (video.getAttribute('src') !== url) video.src = url;

        this.active = true;
        video.play()
          .then(() => { if (this.active) video.classList.add('on'); })
          .catch(() => {});
      }, 6000);
    },

    cancel() {
      this.active = false;
      clearTimeout(this.timeoutID);
      clearTimeout(this.fadeID);
      video.classList.remove('on');
      this.fadeID = window.setTimeout(() => video.pause(), 1600);
    },
  };

  window.addEventListener('visibilitychange', () => {
    if (document.hidden) idling.cancel();
    else idling.start();
  }, { signal });

  idling.start();

  // DOM action =====================================================================================================================================

  layout();

  // routing interactions ===========================================================================================================================



  // --- cleanup ====================================================================================================================================
  return () => {
    ac.abort();
    cancelAnimationFrame(raf);
    running = false;
    clearTimeout(idling.timeoutID);
    clearTimeout(idling.fadeID);
    video.pause();
    video.removeAttribute('src');
    video.load();                    // releases the file
  };
}