// ─────────────────────────────────────────────
// TYPEWRITER
// ─────────────────────────────────────────────
const NAME = "Shania Siew";
const nameEl = document.getElementById("typed-name");
let i = 0;

function typeName() {
  if (!nameEl) return;

  if (i <= NAME.length) {
    nameEl.textContent = NAME.slice(0, i);
    i++;
    setTimeout(typeName, i === 1 ? 500 : 100);
  }
}

// ─────────────────────────────────────────────
// NAV SCROLL EFFECT
// ─────────────────────────────────────────────
window.addEventListener(
  "scroll",
  () => {
    document
      .getElementById("nav")
      .classList.toggle("scrolled", window.scrollY > 20);
  },
  { passive: true }
);

// ─────────────────────────────────────────────
// SMOOTH SCROLL
// ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ─────────────────────────────────────────────
// SKILL ANIMATION
// ─────────────────────────────────────────────
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.querySelectorAll(".skill-row").forEach((row, idx) => {
        const fill = row.querySelector(".skill-fill");
        const pctEl = row.querySelector(".skill-pct");
        const target = parseInt(fill.dataset.target);

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
  },
  { threshold: 0.3 }
);

const skillSection = document.querySelector(".skill-list");
if (skillSection) skillObserver.observe(skillSection);

// ─────────────────────────────────────────────
// FADE UP ON SCROLL
// ─────────────────────────────────────────────
document
  .querySelectorAll(".about-grid, .skill-list, .contact-grid")
  .forEach((el) => el.classList.add("fade-up"));

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".fade-up").forEach((el) => {
  fadeObserver.observe(el);
});

// ─────────────────────────────────────────────
// CONTACT FORM VALIDATION
// ─────────────────────────────────────────────
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

function validate(field) {
  const val = field.value.trim();
  const ok =
    val &&
    (field.type !== "email" ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));

  field.classList.toggle("error", !ok);
  return ok;
}

if (form) {
  form.querySelectorAll("input, textarea").forEach((f) => {
    f.addEventListener("input", () => {
      if (f.classList.contains("error")) validate(f);
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fields = [...form.querySelectorAll("input, textarea")];

    if (!fields.map(validate).every(Boolean)) {
      statusEl.textContent = "Please fill in all fields correctly.";
      statusEl.className = "form-status error";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    statusEl.textContent = "";

    await new Promise((r) => setTimeout(r, 1200));

    statusEl.textContent = "✓ Message sent! I'll get back to you soon.";
    statusEl.className = "form-status success";
    form.reset();

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
      statusEl.textContent = "";
      statusEl.className = "form-status";
    }, 4000);
  });
}

// ─────────────────────────────────────────────
// TYPE NAME START
// ─────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () =>
  setTimeout(typeName, 300)
);

// ─────────────────────────────────────────────
// THEME TOGGLE
// ─────────────────────────────────────────────
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light");
    body.classList.toggle("dark");

    themeToggle.textContent = body.classList.contains("light")
      ? "☀️"
      : "🌙";
  });
}

// ─────────────────────────────────────────────
// MOBILE MENU (CLEAN FIXED VERSION)
// ─────────────────────────────────────────────
const menuToggle = document.getElementById("menuToggle");
const closeNav = document.getElementById("closeNav");
const navLinks = document.querySelector(".nav-links");

function openMenu() {
  navLinks.classList.add("active");
  document.body.classList.add("nav-open");

  // optional: hide hamburger when open
  if (menuToggle) menuToggle.style.display = "none";
}

function closeMenu() {
  navLinks.classList.remove("active");
  document.body.classList.remove("nav-open");

  // restore hamburger
  if (menuToggle) menuToggle.style.display = "block";
}

if (menuToggle) menuToggle.addEventListener("click", openMenu);
if (closeNav) closeNav.addEventListener("click", closeMenu);

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});