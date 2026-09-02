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
  var a11yWidget = document.getElementById("a11yWidget");
  if (a11yWidget) {
    var root = document.documentElement;
    var FONT_MIN = -2, FONT_MAX = 3;

    var a11yToggle = document.getElementById("a11yToggle");
    var a11yClose = document.getElementById("a11yClose");
    var fontDown = document.getElementById("a11yFontDown");
    var fontUp = document.getElementById("a11yFontUp");
    var fontReset = document.getElementById("a11yFontReset");
    var themeToggle = document.getElementById("a11yThemeToggle");
    var themeLabel = document.getElementById("a11yThemeLabel");
    var themeIcon = themeToggle.querySelector(".a11y-theme-icon");

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

    function openPanel() {
      a11yWidget.classList.add("open");
      a11yToggle.setAttribute("aria-expanded", "true");
    }
    function closePanel() {
      a11yWidget.classList.remove("open");
      a11yToggle.setAttribute("aria-expanded", "false");
    }

    applyFontStep(getFontStep());
    applyTheme(isDark());

    a11yToggle.addEventListener("click", function () {
      if (a11yWidget.classList.contains("open")) closePanel();
      else openPanel();
    });
    a11yClose.addEventListener("click", closePanel);
    document.addEventListener("click", function (e) {
      if (a11yWidget.classList.contains("open") && !a11yWidget.contains(e.target)) closePanel();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && a11yWidget.classList.contains("open")) closePanel();
    });
    fontDown.addEventListener("click", function () { setFontStep(getFontStep() - 1); });
    fontUp.addEventListener("click", function () { setFontStep(getFontStep() + 1); });
    fontReset.addEventListener("click", function () { setFontStep(0); });
    themeToggle.addEventListener("click", function () { setTheme(!isDark()); });
  }
})();
