// Click a gallery image to view it large; click again or press Esc to close.
var box = document.getElementById('lightbox');
if (box) {
  var boxImg = box.querySelector('img');
  document.querySelectorAll('.gallery img').forEach(function (img) {
    img.addEventListener('click', function () {
      boxImg.src = img.src;
      boxImg.alt = img.alt;
      box.classList.add('open');
    });
  });
  box.addEventListener('click', function () { box.classList.remove('open'); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') box.classList.remove('open');
  });
}

if ('IntersectionObserver' in window) {
  var observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);

      var figure = entry.target;
      var image = figure.querySelector('img');
      if (!image) { figure.classList.add('is-visible'); return; }

      function show() {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            figure.classList.add('is-visible');
          });
        });
      }

      function fail() { figure.classList.add('is-load-error'); }

      // decode() waits until the browser has fully processed the image,
      // so the heavy work happens while it's still invisible.
      // The 3 second timeout means an image never stays hidden.
      function whenReady() {
        if (image.naturalWidth === 0) { fail(); return; }
        if (image.decode) {
          var timeout = new Promise(function (resolve) { setTimeout(resolve, 3000); });
          Promise.race([image.decode().catch(function () {}), timeout]).then(show);
        } else {
          show();
        }
      }

      if (image.complete) {
        whenReady();
      } else {
        image.addEventListener('load', whenReady, { once: true });
        image.addEventListener('error', fail, { once: true });
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.gallery, .project-banners').forEach(function (container) {
    container.classList.add('reveal-ready');
    container.querySelectorAll('.gallery figure, .project-banners section').forEach(function (item) {
      observer.observe(item);
    });
  });
}

document.querySelectorAll('[data-illustration-carousel]').forEach(function (carousel) {
  var gallery = carousel.querySelector('.illustration-gallery');
  var previousButton = carousel.querySelector('[data-carousel-previous]');
  var nextButton = carousel.querySelector('[data-carousel-next]');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function updateButtons() {
    previousButton.disabled = gallery.scrollLeft <= 1;
    nextButton.disabled = gallery.scrollWidth - gallery.clientWidth - gallery.scrollLeft <= 1;
  }

  function move(direction) {
    var figures = Array.prototype.slice.call(gallery.querySelectorAll('figure'));
    if (!figures.length) return;

    var currentIndex = figures.findIndex(function (figure) {
      return figure.offsetLeft >= gallery.scrollLeft - 1;
    });
    if (currentIndex < 0) currentIndex = figures.length - 1;

    var targetIndex = Math.max(0, Math.min(figures.length - 1, currentIndex + direction));
    gallery.scrollTo({
      left: figures[targetIndex].offsetLeft,
      behavior: reduceMotion.matches ? 'auto' : 'smooth'
    });
  }

  previousButton.addEventListener('click', function () { move(-1); });
  nextButton.addEventListener('click', function () { move(1); });
  gallery.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);
  updateButtons();
});
