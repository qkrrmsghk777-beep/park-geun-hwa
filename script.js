// =====================
// 기본 DOM 참조
// =====================
const revealItems = document.querySelectorAll("[data-reveal]");
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav a");

const progressFill = document.getElementById("progressFill");
const heroGrid = document.getElementById("heroGrid");
const heroWordmark = document.getElementById("heroWordmark");

const tiltCards = document.querySelectorAll("[data-tilt]");
const magneticItems = document.querySelectorAll("[data-magnetic]");
const watermarks = document.querySelectorAll(".section-watermark");

const filmOpenButton = document.getElementById("filmOpenButton");
const filmCloseButton = document.getElementById("filmCloseButton");
const filmModal = document.getElementById("filmModal");
const filmVideo = filmModal ? filmModal.querySelector("video") : null;

// =====================
// Reveal Observer (성능 개선)
// =====================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target); // ✅ 한 번만 실행
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -8% 0px",
  },
);

revealItems.forEach((item) => revealObserver.observe(item));

// =====================
// Section Active Nav
// =====================
const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting);
    if (!visible.length) return;

    const targetEntry = visible[visible.length - 1];

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${targetEntry.target.id}`,
      );
    });
  },
  {
    threshold: 0,
    rootMargin: "-40% 0px -50% 0px",
  },
);

sections.forEach((section) => sectionObserver.observe(section));

// =====================
// Scroll Progress (throttle 적용)
// =====================
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (progressFill) {
    progressFill.style.height = `${progress}%`;
  }

  if (heroWordmark) {
    heroWordmark.style.setProperty("--hero-wordmark-y", `${progress * 0.18}px`);
  }

  watermarks.forEach((mark) => {
    const rect = mark.parentElement.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const yPos = (window.innerHeight - rect.top) * 0.15;
      mark.style.transform = `translateY(${-yPos}px)`;
    }
  });
}

let ticking = false;
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateScrollProgress();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
updateScrollProgress();

// =====================
// Hero Glow (부드러운 easing)
// =====================
if (heroGrid) {
  let gx = 50,
    gy = 35;
  let tx = 50,
    ty = 35;

  function animateGlow() {
    gx += (tx - gx) * 0.08;
    gy += (ty - gy) * 0.08;

    heroGrid.style.setProperty("--glow-x", `${gx}%`);
    heroGrid.style.setProperty("--glow-y", `${gy}%`);

    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  heroGrid.addEventListener("mousemove", (e) => {
    const rect = heroGrid.getBoundingClientRect();
    tx = ((e.clientX - rect.left) / rect.width) * 100;
    ty = ((e.clientY - rect.top) / rect.height) * 100;
  });
}

// =====================
// Magnetic 효과 (부드럽게)
// =====================
magneticItems.forEach((item) => {
  const inner = item.querySelector(".magnetic-inner");
  if (!inner) return;

  let mx = 0,
    my = 0;
  let tx = 0,
    ty = 0;

  function animate() {
    tx += (mx - tx) * 0.1;
    ty += (my - ty) * 0.1;
    inner.style.transform = `translate(${tx}px, ${ty}px)`;
    requestAnimationFrame(animate);
  }
  animate();

  item.addEventListener("mousemove", (e) => {
    const rect = item.getBoundingClientRect();
    mx = (e.clientX - rect.left - rect.width / 2) * 0.2;
    my = (e.clientY - rect.top - rect.height / 2) * 0.2;
  });

  item.addEventListener("mouseleave", () => {
    mx = 0;
    my = 0;
  });
});

// =====================
// Tilt 효과
// =====================
tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = (x / rect.width - 0.5) * 6;
    const rotateX = -(y / rect.height - 0.5) * 5;

    card.style.setProperty("--rotate-x", `${rotateX}deg`);
    card.style.setProperty("--rotate-y", `${rotateY}deg`);
  });

  card.addEventListener("mouseleave", () => {
    card.style.setProperty("--rotate-x", `0deg`);
    card.style.setProperty("--rotate-y", `0deg`);
  });
});

// =====================
// Film Modal
// =====================
function openFilmModal() {
  if (!filmModal) return;
  filmModal.classList.add("open");
  document.body.style.overflow = "hidden";

  if (filmVideo) {
    filmVideo.currentTime = 0;
    filmVideo.play().catch(() => {});
  }
}

function closeFilmModal() {
  if (!filmModal) return;
  filmModal.classList.remove("open");
  document.body.style.overflow = "";

  if (filmVideo) {
    filmVideo.pause();
  }
}

filmOpenButton?.addEventListener("click", openFilmModal);
filmCloseButton?.addEventListener("click", closeFilmModal);

filmModal?.addEventListener("click", (e) => {
  if (e.target === filmModal) closeFilmModal();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && filmModal?.classList.contains("open")) {
    closeFilmModal();
  }
});

// =====================
// Sidebar
// =====================
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const sidebarClose = document.getElementById("sidebarClose");

function openSidebar() {
  sidebar?.classList.add("active");
  sidebarOverlay?.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeSidebar() {
  sidebar?.classList.remove("active");
  sidebarOverlay?.classList.remove("active");
  document.body.style.overflow = "";
}

sidebarToggle?.addEventListener("click", openSidebar);
sidebarClose?.addEventListener("click", closeSidebar);
sidebarOverlay?.addEventListener("click", closeSidebar);

// =====================
// Lightbox
// =====================
const artworkThumbs = document.querySelectorAll(".artwork-thumb");
const lightboxModal = document.getElementById("lightboxModal");
const lightboxContent = document.getElementById("lightboxContent");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(src, type) {
  if (!lightboxContent || !lightboxModal) return;

  lightboxContent.innerHTML = "";

  if (type === "video") {
    lightboxContent.innerHTML = `<video src="${src}" controls autoplay playsinline></video>`;
  } else {
    lightboxContent.innerHTML = `<img src="${src}" alt="Artwork" />`;
  }

  lightboxModal.classList.add("active");
}

artworkThumbs.forEach((thumb) => {
  thumb.addEventListener("click", () => {
    const fullSrc = thumb.getAttribute("data-full");
    const type = thumb.getAttribute("data-type");
    if (fullSrc) openLightbox(fullSrc, type);
  });
});

lightboxClose?.addEventListener("click", () => {
  lightboxModal?.classList.remove("active");
});

lightboxModal?.addEventListener("click", (e) => {
  if (e.target === lightboxModal) {
    lightboxModal.classList.remove("active");
  }
});

// =====================
// Top Button
// =====================
const topButton = document.getElementById("topButton");

window.addEventListener("scroll", () => {
  if (!topButton) return;

  if (window.scrollY > 600) {
    topButton.classList.add("visible");
  } else {
    topButton.classList.remove("visible");
  }
});

topButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// =====================
// Artwork Slider
// =====================
const artworkGroups = document.querySelectorAll(".artwork-group");

artworkGroups.forEach((group) => {
  const grid = group.querySelector(".artwork-grid");
  const navContainer = group.querySelector(".artwork-nav");
  const prevBtn = group.querySelector(".slider-prev");
  const nextBtn = group.querySelector(".slider-next");

  if (!grid || !navContainer || !prevBtn || !nextBtn) return;

  const thumbsCount = grid.querySelectorAll(".artwork-thumb").length;

  if (thumbsCount <= 2) {
    navContainer.style.display = "none";
  } else {
    const scrollAmount = () =>
      (grid.querySelector(".artwork-thumb").clientWidth + 16) * 2;

    prevBtn.addEventListener("click", () => {
      grid.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      grid.scrollBy({ left: scrollAmount(), behavior: "smooth" });
    });
  }
});

