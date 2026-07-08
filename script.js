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
   PARALLAX BACKGROUND EFFECT
   ============================================= */

const background = document.querySelector(".background-animation");

window.addEventListener("scroll", () => {
  if(background){
    const scrollY = window.scrollY;
    background.style.transform = `translateY(${scrollY * 0.15}px)`;
  }
});

/* =============================================
   NAV: SCROLL BLUR + ACTIVE LINK HIGHLIGHT
   ============================================= */
const nav     = document.getElementById("nav");
const navAnchors = document.querySelectorAll(".nav-links a");
const sections   = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  // blur nav on scroll
  nav.classList.toggle("scrolled", window.scrollY > 20);

  // highlight active section in nav
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
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
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

// close on any nav link tap
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

/* =============================================
   THEME TOGGLE
   ============================================= */
const themeToggle = document.getElementById("themeToggle");
const body        = document.body;

if (themeToggle) {
  // restore saved preference
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
   SKILL BARS (scroll-triggered)
   ============================================= */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll(".skill-row").forEach((row, idx) => {
      const fill  = row.querySelector(".skill-fill");
      const pctEl = row.querySelector(".skill-pct");
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
   SCROLL REVEAL (.reveal elements)
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
   PROJECT FILTER TABS
   ============================================= */
const filterBtns  = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    // update active tab
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !matches);
      // re-trigger reveal for cards that become visible
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
   CONTACT FORM — IMPROVED VALIDATION
   ============================================= */
const form      = document.getElementById("contactForm");
const statusEl  = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

const rules = {
  fname:    { el: null, err: null, check: v => v.trim().length >= 2,    msg: "Please enter your name (at least 2 characters)." },
  femail:   { el: null, err: null, check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: "Please enter a valid email address." },
  fmessage: { el: null, err: null, check: v => v.trim().length >= 10,   msg: "Message must be at least 10 characters." },
};

if (form) {
  // cache elements
  Object.keys(rules).forEach(id => {
    rules[id].el  = document.getElementById(id);
    rules[id].err = document.getElementById(id === "fname" ? "nameError" : id === "femail" ? "emailError" : "messageError");
  });

  function validateField(id) {
    const { el, err, check, msg } = rules[id];
    const ok = check(el.value);
    el.classList.toggle("error", !ok);
    if (err) err.textContent = ok ? "" : msg;
    return ok;
  }

  // live validation on blur
  Object.keys(rules).forEach(id => {
    rules[id].el.addEventListener("blur",  () => validateField(id));
    rules[id].el.addEventListener("input", () => {
      if (rules[id].el.classList.contains("error")) validateField(id);
    });
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();

    // validate all fields
    const allOk = Object.keys(rules).map(id => validateField(id)).every(Boolean);
    if (!allOk) {
      statusEl.textContent = "Please fix the errors above.";
      statusEl.className = "form-status error";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    statusEl.textContent  = "";
    statusEl.className    = "form-status";

    // Simulated send — replace with Formspree or backend fetch
    await new Promise(r => setTimeout(r, 1300));

    statusEl.textContent = "✓ Message sent! I'll get back to you soon.";
    statusEl.className   = "form-status success";
    form.reset();
    Object.keys(rules).forEach(id => {
      rules[id].el.classList.remove("error");
      if (rules[id].err) rules[id].err.textContent = "";
    });

    setTimeout(() => {
      submitBtn.disabled    = false;
      submitBtn.textContent = "Send Message";
      statusEl.textContent  = "";
      statusEl.className    = "form-status";
    }, 4000);
  });
}

/* =============================================
   INIT
   ============================================= */
window.addEventListener("DOMContentLoaded", () => setTimeout(typeName, 300));

/* =============================================
   BACK TO TOP BUTTON
   ============================================= */

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll",()=>{

if(window.scrollY > 500){
topBtn.classList.add("show");
}else{
topBtn.classList.remove("show");
}

});


topBtn.addEventListener("click",()=>{

window.scrollTo({
top:0,
behavior:"smooth"
});

});