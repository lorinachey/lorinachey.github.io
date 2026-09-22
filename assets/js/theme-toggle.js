// Theme override. The inline snippet in <head> has already applied any stored
// choice before first paint; this file owns the control and persistence.
//
// "System" is modelled as the ABSENCE of both the data-theme attribute and the
// stored key, so clearing site data falls back to the OS with no migration and
// there is no "system" string for the CSS to understand.
(function () {
  var KEY = 'theme';
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  var status = document.getElementById('theme-status');
  var mql = window.matchMedia('(prefers-color-scheme: dark)');

  var LABEL = {
    system: 'Theme: match system',
    light: 'Theme: light',
    dark: 'Theme: dark'
  };

  // localStorage throws on ACCESS (not just write) in some private-browsing
  // modes and when site data is blocked, so the read is inside the try too.
  function read() {
    try {
      var v = localStorage.getItem(KEY);
      return v === 'light' || v === 'dark' ? v : 'system';
    } catch (e) {
      return 'system';
    }
  }

  function write(mode) {
    try {
      if (mode === 'system') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, mode);
    } catch (e) {}
  }

  function apply(mode) {
    if (mode === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', mode);

    if (btn) {
      btn.setAttribute('data-state', mode);
      btn.setAttribute('aria-label', LABEL[mode]);
      btn.setAttribute('title', LABEL[mode]);
    }
  }

  var mode = read();
  apply(mode);

  if (btn) {
    btn.hidden = false;

    btn.addEventListener('click', function () {
      // Order is recomputed from the OS each click so that position 2 is always
      // the opposite of what the visitor is currently seeing. A fixed
      // system -> light -> dark order makes the first press a no-op on a
      // light-preferring machine, which reads as a broken button.
      var os = mql.matches ? 'dark' : 'light';
      var order = ['system', os === 'dark' ? 'light' : 'dark', os];
      mode = order[(order.indexOf(mode) + 1) % order.length];
      apply(mode);
      write(mode);
      if (status) status.textContent = LABEL[mode];
    });
  }

  // While following the OS, the CSS re-resolves itself on a preference change;
  // this only keeps the button's own state in step. In override mode it
  // deliberately does nothing -- an explicit choice must survive an OS change.
  function onSystemChange() {
    if (mode === 'system') apply('system');
  }
  if (mql.addEventListener) mql.addEventListener('change', onSystemChange);
  else if (mql.addListener) mql.addListener(onSystemChange); // Safari < 14
})();
