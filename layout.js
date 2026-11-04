// Shared header + footer for every page. Edit here and all pages update.
(function () {
  // Figure out which page we're on so the right menu tab turns pink
  var page = location.pathname.split('/').pop() || 'index.html';
  if (page.indexOf('.') === -1) page += '.html';

  // MENU: [page file, label shown]. Add or rename tabs here.
  var tabs = [
    ['index.html', 'Home'],
    ['professional-work.html', 'Professional Work'],
    ['pleinair.html', 'Pleinair'],
    ['about.html', 'About']
  ];
  var menu = tabs.map(function (t) {
    var cls = (t[0] === page) ? ' class="active"' : '';
    return '<li><a href="' + t[0] + '"' + cls + '>' + t[1] + '</a></li>';
  }).join('');

  // HEADER: logo, name, tagline, menu
  var header = document.querySelector('header');
  if (header) {
    header.innerHTML =
      '<div>' +
        '<a href="index.html" class="logo"><img src="logo.png" alt="Michelle Wirono logo"></a>' +
        '<a href="index.html"><h1>Michelle<br>Wirono</h1></a>' +
        '<p class="tagline">Concept Art | Visual Development</p>' +
      '</div>' +
      '<nav><ul>' + menu + '</ul></nav>';
  }

  // FOOTER: email + copyright
  var footer = document.querySelector('footer');
  if (footer) {
    footer.innerHTML =
      '<a href="mailto:wironomichelle@gmail.com">wironomichelle@gmail.com</a><br>' +
      '&copy; 2026 Michelle Wirono. All artwork is copyrighted and may not be used without permission.';
  }
})();