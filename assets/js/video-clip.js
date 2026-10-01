// Starts silent looping clips when they scroll into view, and only when the
// visitor has not asked for reduced motion. Progressive enhancement: if this
// file never runs, each clip is a poster with native controls.
(function () {
  var clips = document.querySelectorAll('video[data-clip]');
  if (!clips.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function start(v) {
    v.muted = true;
    var p = v.play();
    if (p && p.then) {
      // Once it is really playing, the controls are noise on a thumbnail.
      p.then(function () { v.removeAttribute('controls'); }).catch(function () {});
    }
  }

  if (!('IntersectionObserver' in window)) {
    clips.forEach(start);
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) start(entry.target);
      else entry.target.pause();
    });
  }, { threshold: 0.25 });

  clips.forEach(function (v) { io.observe(v); });
})();
