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

  /* ---------------- Scroll-spy active link ---------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href").replace("#", "");
      return document.getElementById(id);
    })
    .filter(Boolean);

  var spyObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach(function (s) { spyObserver.observe(s); });

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

  /* ---------------- Accordion (Ponencias) ---------------- */
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
  var galleryLinks = Array.prototype.slice.call(document.querySelectorAll("#galleryGrid a"));
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbClose = document.getElementById("lbClose");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");
  var currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lbImg.src = galleryLinks[index].getAttribute("data-full");
    lbImg.alt = galleryLinks[index].querySelector("img").alt;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }
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
})();
