(function () {
  "use strict";

  const header = document.querySelector("header");
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const toTop = document.getElementById("to-top");
  const darkToggle = document.getElementById("dark-toggle");
  const html = document.documentElement;

  /* ---------- Sticky navbar + back to top ---------- */
  function onScroll() {
    const fixedNav = header.offsetTop;
    if (window.pageYOffset > fixedNav) {
      header.classList.add("navbar-fixed");
      toTop.classList.remove("hidden");
      toTop.classList.add("flex");
    } else {
      header.classList.remove("navbar-fixed");
      toTop.classList.remove("flex");
      toTop.classList.add("hidden");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Hamburger menu ---------- */
  function closeMenu() {
    hamburger.classList.remove("hamburger-active");
    hamburger.setAttribute("aria-expanded", "false");
    navMenu.classList.add("hidden");
  }
  hamburger.addEventListener("click", function (e) {
    e.stopPropagation();
    const open = hamburger.classList.toggle("hamburger-active");
    hamburger.setAttribute("aria-expanded", String(open));
    navMenu.classList.toggle("hidden", !open);
  });
  window.addEventListener("click", function (e) {
    if (e.target !== hamburger && !navMenu.contains(e.target)) closeMenu();
  });
  navMenu.querySelectorAll("a.nav-link").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1024) {
      hamburger.classList.remove("hamburger-active");
      navMenu.classList.remove("hidden");
    } else if (!hamburger.classList.contains("hamburger-active")) {
      navMenu.classList.add("hidden");
    }
  });

  /* ---------- Active navigation indicator ---------- */
  const links = Array.from(document.querySelectorAll("a.nav-link"));
  const sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  function setActive() {
    const pos = window.scrollY + window.innerHeight * 0.35;
    let currentId = sections[0] ? sections[0].id : "";
    sections.forEach(function (s) {
      if (s.offsetTop <= pos) currentId = s.id;
    });
    // Di dasar halaman, tandai section terakhir
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4 && sections.length) {
      currentId = sections[sections.length - 1].id;
    }
    links.forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + currentId);
    });
  }
  window.addEventListener("scroll", setActive, { passive: true });
  setActive();

  /* ---------- Dark mode ---------- */
  function applyTheme(dark) {
    html.classList.toggle("dark", dark);
    darkToggle.checked = dark;
  }
  let stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  if (stored) {
    applyTheme(stored === "dark");
  } else {
    applyTheme(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
  darkToggle.addEventListener("change", function () {
    applyTheme(darkToggle.checked);
    try { localStorage.setItem("theme", darkToggle.checked ? "dark" : "light"); } catch (e) {}
  });

  /* ---------- Render kartu portfolio ---------- */
  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  const grid = document.getElementById("portfolio-grid");
  if (grid && typeof PROJECTS !== "undefined") {
    grid.innerHTML = PROJECTS.map(function (p) {
      const btn = p.link
        ? '<a href="' + esc(p.link) + '" target="_blank" rel="noopener noreferrer" class="inline-block rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white transition duration-300 hover:opacity-80">' +
          esc(p.linkLabel || "Lihat Project") + ' <i class="fa-solid fa-arrow-up-right-from-square ml-1 text-xs"></i></a>'
        : "";
      return (
        '<div class="mb-12 w-full px-4 md:w-1/2 xl:w-1/3" data-reveal>' +
          '<article class="project-card overflow-hidden rounded-xl bg-white shadow-md dark:bg-slate-700">' +
            '<div class="thumb relative aspect-[16/10] overflow-hidden thumb-placeholder">' +
              '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy" class="h-full w-full object-cover" onerror="this.style.display=\'none\'" />' +
              '<div class="pointer-events-none absolute inset-0 flex items-center justify-center text-primary/60"><i class="fa-regular fa-image text-4xl"></i></div>' +
              '<div class="thumb-overlay pointer-events-none absolute inset-0"></div>' +
              '<span class="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary">' + esc(p.category) + '</span>' +
            '</div>' +
            '<div class="px-6 py-6">' +
              '<h3 class="mb-3 text-xl font-semibold text-dark dark:text-white">' + esc(p.title) + '</h3>' +
              '<p class="mb-5 text-base font-medium text-secondary dark:text-slate-300">' + esc(p.description) + '</p>' +
              btn +
            '</div>' +
          '</article>' +
        '</div>'
      );
    }).join("");
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Tahun footer ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
