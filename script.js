/* =============================================
   TYPEWRITER
   ============================================= */
const NAME   = "Shania Siew";
const nameEl = document.getElementById("typed-name");
let charIndex = 0;

function typeName() {
  if (!nameEl) return;
  if (charIndex <= NAME.length) {
    nameEl.textContent = NAME.slice(0, charIndex);
    charIndex++;
    setTimeout(typeName, charIndex === 1 ? 500 : 100);
  }
}

/* =============================================
   NAV: SCROLL BLUR + ACTIVE LINK
   ============================================= */
const nav        = document.getElementById("nav");
const navAnchors = document.querySelectorAll(".nav-links a");
const sections   = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 20);

  let current = "";
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle("active-link", a.getAttribute("href") === "#" + current);
  });
}, { passive: true });

/* =============================================
   SMOOTH SCROLL
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); }
  });
});

/* =============================================
   MOBILE MENU
   ============================================= */
const menuToggle = document.getElementById("menuToggle");
const closeNav   = document.getElementById("closeNav");
const navLinks   = document.getElementById("navLinks");
const navOverlay = document.getElementById("navOverlay");

function openMenu() {
  navLinks.classList.add("active");
  navOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  navLinks.classList.remove("active");
  navOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

if (menuToggle) menuToggle.addEventListener("click", openMenu);
if (closeNav)   closeNav.addEventListener("click", closeMenu);
if (navOverlay) navOverlay.addEventListener("click", closeMenu);
document.querySelectorAll(".nav-links a").forEach(l => l.addEventListener("click", closeMenu));

/* =============================================
   THEME TOGGLE
   ============================================= */
const themeToggle = document.getElementById("themeToggle");
const body        = document.body;

if (themeToggle) {
  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    body.classList.replace("dark", "light");
    themeToggle.textContent = "☀️";
  }

  themeToggle.addEventListener("click", () => {
    const isLight = body.classList.toggle("light");
    body.classList.toggle("dark", !isLight);
    themeToggle.textContent = isLight ? "☀️" : "🌙";
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
}

/* =============================================
   SKILL BARS
   ============================================= */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll(".skill-row").forEach((row, idx) => {
      const fill   = row.querySelector(".skill-fill");
      const pctEl  = row.querySelector(".skill-pct");
      const target = parseInt(fill.dataset.target, 10);
      setTimeout(() => {
        fill.style.width = target + "%";
        if (pctEl) {
          let count = 0;
          const step = setInterval(() => {
            count = Math.min(count + 2, target);
            pctEl.textContent = count + "%";
            if (count >= target) clearInterval(step);
          }, 20);
        }
      }, idx * 100);
    });
    skillObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

const skillList = document.querySelector(".skill-list");
if (skillList) skillObserver.observe(skillList);

/* =============================================
   SCROLL REVEAL
   ============================================= */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* =============================================
   PROJECT FILTER
   ============================================= */
const filterBtns   = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !matches);
      if (matches) {
        card.classList.remove("visible");
        setTimeout(() => card.classList.add("visible"), 20);
      }
    });
  });
});

/* =============================================
   RESUME DOWNLOAD FEEDBACK
   ============================================= */
const resumeBtn = document.getElementById("resumeBtn");
if (resumeBtn) {
  resumeBtn.addEventListener("click", () => {
    const orig = resumeBtn.innerHTML;
    resumeBtn.textContent = "Downloading…";
    resumeBtn.style.pointerEvents = "none";
    setTimeout(() => {
      resumeBtn.innerHTML = orig;
      resumeBtn.style.pointerEvents = "";
    }, 2000);
  });
}

/* =============================================
   CONTACT FORM VALIDATION
   ============================================= */
const form      = document.getElementById("contactForm");
const statusEl  = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

const rules = {
  fname:    { el: null, err: null, check: v => v.trim().length >= 2,                          msg: "Please enter your name (at least 2 characters)." },
  femail:   { el: null, err: null, check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: "Please enter a valid email address." },
  fmessage: { el: null, err: null, check: v => v.trim().length >= 10,                         msg: "Message must be at least 10 characters." },
};

if (form) {
  Object.keys(rules).forEach(id => {
    rules[id].el  = document.getElementById(id);
    rules[id].err = document.getElementById(
      id === "fname" ? "nameError" : id === "femail" ? "emailError" : "messageError"
    );
  });

  function validateField(id) {
    const { el, err, check, msg } = rules[id];
    const ok = check(el.value);
    el.classList.toggle("error", !ok);
    if (err) err.textContent = ok ? "" : msg;
    return ok;
  }

  Object.keys(rules).forEach(id => {
    rules[id].el.addEventListener("blur",  () => validateField(id));
    rules[id].el.addEventListener("input", () => {
      if (rules[id].el.classList.contains("error")) validateField(id);
    });
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const allOk = Object.keys(rules).map(id => validateField(id)).every(Boolean);
    if (!allOk) {
      statusEl.textContent = "Please fix the errors above.";
      statusEl.className = "form-status error";
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    statusEl.textContent = "";
    statusEl.className = "form-status";

const res = await fetch("https://formspree.io/f/maqryebv", {
  method: "POST",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  body: JSON.stringify({
    name:    rules.fname.el.value,
    email:   rules.femail.el.value,
    message: rules.fmessage.el.value
  })
});
if (!res.ok) throw new Error("failed");

    await new Promise(r => setTimeout(r, 1300));

    statusEl.textContent = "✓ Message sent! I'll get back to you soon.";
    statusEl.className = "form-status success";
    form.reset();
    Object.keys(rules).forEach(id => {
      rules[id].el.classList.remove("error");
      if (rules[id].err) rules[id].err.textContent = "";
    });

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
      statusEl.textContent = "";
      statusEl.className = "form-status";
    }, 4000);
  });
}

/* =============================================
   BACK TO TOP
   ============================================= */
const topBtn = document.getElementById("topBtn");
if (topBtn) {
  window.addEventListener("scroll", () => {
    topBtn.classList.toggle("show", window.scrollY > 500);
  }, { passive: true });
  topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* =============================================
   MOUSE TRAIL
   ============================================= */
const trailCanvas = document.getElementById("mouseTrail");
if (trailCanvas) {
  const trailCtx = trailCanvas.getContext("2d");

  function resizeCanvas() {
    trailCanvas.width  = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, { passive: true });

  let trail = [];

  // disable on touch devices — it doesn't make sense there
  const isTouchDevice = window.matchMedia("(hover: none)").matches;

  if (!isTouchDevice) {
    document.addEventListener("mousemove", e => {
      trail.push({ x: e.clientX, y: e.clientY, size: 5, opacity: 0.5 });
    });
  }

  function drawTrail() {
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    trail.forEach(point => {
      trailCtx.beginPath();
      trailCtx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
      trailCtx.fillStyle = `rgba(129,140,248,${point.opacity})`;
      trailCtx.shadowBlur = 5;
      trailCtx.shadowColor = "rgba(169,177,249,0.8)";
      trailCtx.fill();
      point.size    *= 0.92;
      point.opacity *= 0.85;
    });
    trail = trail.filter(p => p.opacity > 0.03);
    requestAnimationFrame(drawTrail);
  }
  drawTrail();
}

/* =============================================
   PARALLAX BACKGROUND
   ============================================= */
const bgAnim = document.querySelector(".background-animation");
window.addEventListener("scroll", () => {
  if (bgAnim) bgAnim.style.transform = `translateY(${window.scrollY * 0.15}px)`;
}, { passive: true });

/* =============================================
   INIT
   ============================================= */
window.addEventListener("DOMContentLoaded", () => setTimeout(typeName, 300));