(function () {
  "use strict";

  /* ---------------- Header scroll state ---------------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile nav toggle ---------------- */
  var navToggle = document.getElementById("navToggle");
  navToggle.addEventListener("click", function () {
    header.classList.toggle("nav-open");
  });
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    link.addEventListener("click", function () {
      header.classList.remove("nav-open");
    });
  });

  /* ---------------- Reveal-on-scroll ---------------- */
  var revealEls = document.querySelectorAll(".reveal");
  var revealObserver = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ---------------- Accordion (Ponencias / Comité) ---------------- */
  document.querySelectorAll(".acc-head").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".acc-item");
      var wasOpen = item.classList.contains("open");
      item.parentElement.querySelectorAll(".acc-item").forEach(function (i) {
        i.classList.remove("open");
      });
      if (!wasOpen) item.classList.add("open");
    });
  });

  /* ---------------- Gallery lightbox ---------------- */
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var galleryLinks = Array.prototype.slice.call(document.querySelectorAll("#galleryGrid a"));
    var lbImg = document.getElementById("lbImg");
    var lbCaption = document.getElementById("lbCaption");
    var lbCounter = document.getElementById("lbCounter");
    var lbClose = document.getElementById("lbClose");
    var lbPrev = document.getElementById("lbPrev");
    var lbNext = document.getElementById("lbNext");
    var currentIndex = 0;

    function openLightbox(index) {
      currentIndex = index;
      var link = galleryLinks[index];
      var img = link.querySelector("img");
      lbImg.classList.remove("loaded");
      lbImg.src = link.getAttribute("data-full");
      lbImg.alt = img.alt;
      if (lbCaption) lbCaption.textContent = img.alt;
      if (lbCounter) lbCounter.textContent = (index + 1) + " / " + galleryLinks.length;
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    lbImg.addEventListener("load", function () { lbImg.classList.add("loaded"); });
    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }
    function showRelative(delta) {
      currentIndex = (currentIndex + delta + galleryLinks.length) % galleryLinks.length;
      openLightbox(currentIndex);
    }

    galleryLinks.forEach(function (link, index) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        openLightbox(index);
      });
    });
    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", function () { showRelative(-1); });
    lbNext.addEventListener("click", function () { showRelative(1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showRelative(-1);
      if (e.key === "ArrowRight") showRelative(1);
    });
  }

  /* ---------------- Accessibility widget ---------------- */
  document.body.insertAdjacentHTML("beforeend", [
    '<div class="a11y-widget" id="a11yWidget">',
    '  <div class="a11y-panel" id="a11yPanel" role="dialog" aria-label="Opciones de accesibilidad" tabindex="-1">',
    '    <div class="a11y-panel-title">',
    "      Accesibilidad",
    '      <button type="button" id="a11yClose" aria-label="Cerrar panel de accesibilidad">&#10005;</button>',
    "    </div>",
    '    <div class="a11y-group">',
    '      <span class="label">Tamano del texto</span>',
    '      <div class="a11y-fontsize">',
    '        <button type="button" id="a11yFontDown" aria-label="Reducir tamano de texto">A&minus;</button>',
    '        <button type="button" id="a11yFontReset" aria-label="Restablecer tamano de texto">A</button>',
    '        <button type="button" id="a11yFontUp" aria-label="Aumentar tamano de texto">A+</button>',
    "      </div>",
    "    </div>",
    '    <div class="a11y-group">',
    '      <span class="label">Apariencia</span>',
    '      <button type="button" class="a11y-theme-btn" id="a11yThemeToggle" aria-pressed="false">',
    '        <span class="a11y-theme-icon" aria-hidden="true"></span>',
    '        <span id="a11yThemeLabel">Modo oscuro</span>',
    "      </button>",
    "    </div>",
    "  </div>",
    '  <button type="button" class="a11y-toggle" id="a11yToggle" aria-label="Abrir opciones de accesibilidad" aria-expanded="false" aria-controls="a11yPanel">',
    '    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="7.4" r="1.5" fill="currentColor" stroke="none"/><path d="M6.2 10.4c1.9-.75 3.8-1.1 5.8-1.1s3.9.35 5.8 1.1"/><path d="M12 9.3v4.5l-2.5 5.7"/><path d="M12 13.8l2.5 5.7"/></svg>',
    "  </button>",
    "</div>"
  ].join(""));

  var a11yWidget = document.getElementById("a11yWidget");
  if (a11yWidget) {
    var root = document.documentElement;
    var FONT_MIN = -2, FONT_MAX = 3;

    var a11yPanel = document.getElementById("a11yPanel");
    var a11yToggle = document.getElementById("a11yToggle");
    var a11yClose = document.getElementById("a11yClose");
    var fontDown = document.getElementById("a11yFontDown");
    var fontUp = document.getElementById("a11yFontUp");
    var fontReset = document.getElementById("a11yFontReset");
    var themeToggle = document.getElementById("a11yThemeToggle");
    var themeLabel = document.getElementById("a11yThemeLabel");
    var themeIcon = themeToggle.querySelector(".a11y-theme-icon");
    var lastFocused = null;

    var sunIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    var moonIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

    function getFontStep() {
      var v = parseInt(localStorage.getItem("csaFontStep"), 10);
      if (isNaN(v)) return 0;
      return Math.min(FONT_MAX, Math.max(FONT_MIN, v));
    }
    function applyFontStep(step) {
      root.style.fontSize = (100 + step * 10) + "%";
      fontDown.disabled = step <= FONT_MIN;
      fontUp.disabled = step >= FONT_MAX;
    }
    function setFontStep(step) {
      step = Math.min(FONT_MAX, Math.max(FONT_MIN, step));
      try { localStorage.setItem("csaFontStep", step); } catch (e) {}
      applyFontStep(step);
    }

    function isDark() { return root.getAttribute("data-theme") === "dark"; }
    function applyTheme(dark) {
      if (dark) {
        root.setAttribute("data-theme", "dark");
        themeIcon.innerHTML = moonIcon;
        themeLabel.textContent = "Modo claro";
      } else {
        root.removeAttribute("data-theme");
        themeIcon.innerHTML = sunIcon;
        themeLabel.textContent = "Modo oscuro";
      }
      themeToggle.setAttribute("aria-pressed", String(dark));
    }
    function setTheme(dark) {
      try { localStorage.setItem("csaTheme", dark ? "dark" : "light"); } catch (e) {}
      applyTheme(dark);
    }

    function getFocusable() {
      return Array.prototype.slice.call(
        a11yPanel.querySelectorAll("button:not(:disabled)")
      );
    }
    function openPanel() {
      lastFocused = document.activeElement;
      a11yWidget.classList.add("open");
      a11yToggle.setAttribute("aria-expanded", "true");
      a11yPanel.focus();
    }
    function closePanel(restoreFocus) {
      a11yWidget.classList.remove("open");
      a11yToggle.setAttribute("aria-expanded", "false");
      if (restoreFocus !== false && lastFocused) lastFocused.focus();
      lastFocused = null;
    }

    applyFontStep(getFontStep());
    applyTheme(isDark());

    a11yToggle.addEventListener("click", function () {
      if (a11yWidget.classList.contains("open")) closePanel();
      else openPanel();
    });
    a11yClose.addEventListener("click", closePanel);
    document.addEventListener("click", function (e) {
      if (a11yWidget.classList.contains("open") && !a11yWidget.contains(e.target)) closePanel(false);
    });
    document.addEventListener("keydown", function (e) {
      if (!a11yWidget.classList.contains("open")) return;
      if (e.key === "Escape") {
        closePanel();
        return;
      }
      if (e.key === "Tab") {
        var focusable = getFocusable();
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
    fontDown.addEventListener("click", function () { setFontStep(getFontStep() - 1); });
    fontUp.addEventListener("click", function () { setFontStep(getFontStep() + 1); });
    fontReset.addEventListener("click", function () { setFontStep(0); });
    themeToggle.addEventListener("click", function () { setTheme(!isDark()); });
  }
})();
