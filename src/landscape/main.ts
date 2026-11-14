import './l_styles.css';

export function mount(root: HTMLElement): () => void {
  const ac = new AbortController();

  const body = document.body;
  body.innerHTML = `
  <div class="triangleBtn SP"></div>
    <section id="dynamic-nav">
      <div id="imgCtner"><img id="nkeytosp"></div><div id="pftbiS">Back to Start</div>
    </section>
    <section class="page-flipper">
      <div id="studio-container"></div>
      <div id="cv-container">
        <div id="firstrow"></div>
        <div id="curriculum" class="small"></div>
        <div id="indicator"></div>
      </div>
      <div id="contact-page">
        <form id="contact-form" action="https://submit-form.com/BzCPIVvkV">
          <input type="text" id="c-name" name="name" placeholder="name" autocomplete="on" />
          <input type="email" id="c-email" name="email" placeholder="email - mandatory" autocomplete="on" required="" />
          <input type="text" id="c-subject" name="subject" placeholder="subject" autocomplete="on">
          <textarea type="text" id="c-message" name="message" placeholder="message - mandatory" required></textarea>
          <div class="button-container">
            <button type="submit" id="c-submit" onclick="SendMessage()">Send</button>
          </div>
        </form>
      </div>
      <div id="stpg-container">
        <div id="idiomsiR"><div id="eng">English</div><div id="deu">Deutsch</div><div id="esp">Espa&ntilde;ol</div></div>
        <div id="btnsiR"><div id="currvitae"><span>Curriculum</span></div><div id="studio"><span>Studio</span></div></div>
        <div id="contactiR"><div id="contact"><span>Contact</span></div></div>
      </div>
    </section>
  <script aria-label="data independent script" src="./di_script.js"></script>
  <script aria-label="data dependent script" src="./dd_script.js"></script>
  `;

  window.addEventListener('keydown', e => console.log('landscape key:', e.key),
    { signal: ac.signal });

  return () => ac.abort();
}