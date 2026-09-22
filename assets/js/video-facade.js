// Swaps a video poster for the real player on click. Progressive enhancement:
// if this file never runs, the poster is still a working link to YouTube.
(function () {
  document.querySelectorAll('[data-video]').forEach(function (fig) {
    var link = fig.querySelector('.video-facade');
    var id = fig.dataset.video;
    if (!link || !id) return;

    link.addEventListener('click', function (e) {
      // Let modified clicks open YouTube in a new tab as normal.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();

      var frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      frame.title = link.getAttribute('aria-label') || 'Video player';
      frame.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture';
      frame.allowFullscreen = true;
      frame.className = 'video-frame';

      link.replaceWith(frame);
      frame.focus();
    });
  });
})();
