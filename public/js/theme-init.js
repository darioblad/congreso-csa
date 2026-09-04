(function () {
  try {
    var d = document.documentElement;
    if (localStorage.getItem('csaTheme') === 'dark') {
      d.setAttribute('data-theme', 'dark');
    }
    var s = parseInt(localStorage.getItem('csaFontStep'), 10);
    if (!isNaN(s)) {
      s = Math.max(-2, Math.min(3, s));
      d.style.fontSize = (100 + s * 10) + '%';
    }
  } catch (e) {}
})();
