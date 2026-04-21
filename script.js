/* ═══════════════════════════════════════════════════════════════════
   German Cities: Past & Present — Liquid Glass Interactions
   ═══════════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initHamburgerMenu();
  initImageComparisons();
  initScrollAnimations();
  initCursorBlob();
  initCardTilts();
  initSmoothCards();
});

/* ── Cursor Liquid Blob ────────────────────────────────────────── */
function initCursorBlob() {
  const blob = document.getElementById("cursor-blob");
  if (!blob) return;
  if (window.matchMedia("(pointer: coarse)").matches) return; // Skip on touch

  let blobX = 0, blobY = 0;
  let mouseX = 0, mouseY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    blob.classList.add("active");
  });

  document.addEventListener("mouseleave", () => {
    blob.classList.remove("active");
  });

  // Smooth blob follow using rAF
  function animateBlob() {
    blobX += (mouseX - blobX) * 0.06;
    blobY += (mouseY - blobY) * 0.06;
    blob.style.left = blobX + "px";
    blob.style.top = blobY + "px";
    requestAnimationFrame(animateBlob);
  }
  animateBlob();
}

/* ── 3D Card Tilt ──────────────────────────────────────────────── */
function initCardTilts() {
  const cards = document.querySelectorAll(".city-card");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  cards.forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateX = (0.5 - y) * 14;
      const rotateY = (x - 0.5) * 14;

      card.style.transform =
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
      card.style.transition = "transform 0.1s ease";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)";
      card.style.transition = "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
    });
  });
}

/* ── Smooth Glass Hover Glow ───────────────────────────────────── */
function initSmoothCards() {
  const glassItems = document.querySelectorAll(
    ".content-card, .comparison-example, .food-item, .landmark-embed-wrapper"
  );
  if (window.matchMedia("(pointer: coarse)").matches) return;

  glassItems.forEach(item => {
    item.addEventListener("mousemove", e => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty("--glow-x", x + "px");
      item.style.setProperty("--glow-y", y + "px");
    });
  });
}

/* ── Theme Toggle ──────────────────────────────────────────────── */
function initThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  const stored = localStorage.getItem("gc-theme");
  const prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const startLight = stored ? stored === "light" : !prefersDark;

  if (startLight) document.body.classList.add("light");
  else document.body.classList.remove("light");

  updateIcon(toggle, document.body.classList.contains("light"));

  toggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light");
    localStorage.setItem("gc-theme", isLight ? "light" : "dark");
    updateIcon(toggle, isLight);
  });
}

function updateIcon(btn, isLight) {
  const icon = btn.querySelector(".theme-icon");
  if (icon) icon.textContent = isLight ? "🌙" : "☀️";
}

/* ── Hamburger Menu ────────────────────────────────────────────── */
function initHamburgerMenu() {
  const hamburger = document.getElementById("hamburger");
  const nav = document.querySelector(".main-nav");
  if (!hamburger || !nav) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("is-active");
    nav.classList.toggle("is-open");
    document.body.style.overflow = nav.classList.contains("is-open") ? "hidden" : "";
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("is-active");
      nav.classList.remove("is-open");
      document.body.style.overflow = "";
    });
  });
}

/* ── Image Comparison Slider ───────────────────────────────────── */
function initImageComparisons() {
  document.querySelectorAll(".image-comparison").forEach((comp) => {
    const slider = comp.querySelector(".image-comparison__slider");
    if (!slider) return;

    const sync = (val) => {
      const pct = Math.min(100, Math.max(0, Number(val)));
      comp.style.setProperty("--slider-percent", `${pct}%`);
    };

    sync(slider.value || 50);
    slider.addEventListener("input", (e) => sync(e.target.value));

    // Pointer drag support
    let dragging = false;
    const rect = () => comp.getBoundingClientRect();

    comp.addEventListener("pointerdown", (e) => {
      if (e.target === slider) return;
      dragging = true;
      comp.setPointerCapture(e.pointerId);
      handleDrag(e);
    });

    comp.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      handleDrag(e);
    });

    comp.addEventListener("pointerup", () => { dragging = false; });

    function handleDrag(e) {
      const r = rect();
      const x = e.clientX - r.left;
      const pct = Math.min(100, Math.max(0, (x / r.width) * 100));
      slider.value = pct;
      sync(pct);
    }
  });
}

/* ── Scroll Animations ─────────────────────────────────────────── */
function initScrollAnimations() {
  const targets = document.querySelectorAll(".animate-on-scroll");
  if (!targets.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}
