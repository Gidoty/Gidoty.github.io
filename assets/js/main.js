/** Shared behaviour for every portfolio page: mobile nav, card rendering, tag filters. */

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  links.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

function cardTemplate(item) {
  const tags = (item.tags || []).map((t) => `<span class="tag">${t}</span>`).join("");
  const highlights = (item.highlights || []).length
    ? `<ul class="card-highlights">${item.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>`
    : "";
  const link = item.link
    ? `<a class="card-link" href="${item.link}" target="_blank" rel="noopener">${item.linkLabel || "View more"} &rarr;</a>`
    : "";
  return `
    <article class="card" data-tags="${(item.tags || []).join("|")}">
      <div class="card-body">
        <div class="card-tags">${tags}</div>
        <h3>${item.title}</h3>
        ${item.period ? `<p class="card-period">${item.period}</p>` : ""}
        <p class="card-desc">${item.description || ""}</p>
        ${highlights}
      </div>
      ${link}
    </article>
  `;
}

function renderCards(container, items) {
  if (!container) return;
  container.innerHTML = items.length
    ? items.map(cardTemplate).join("")
    : `<p class="empty-state">Nothing here yet — add entries in assets/js/data.js.</p>`;
}

function initCategoryPage(categoryKey) {
  const items = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA[categoryKey]) || [];
  const grid = document.getElementById("grid");
  const filterBar = document.getElementById("filters");

  const allTags = Array.from(new Set(items.flatMap((item) => item.tags || [])));

  if (filterBar) {
    const chips = ["All", ...allTags]
      .map((tag, i) => `<button class="chip${i === 0 ? " active" : ""}" data-tag="${tag}">${tag}</button>`)
      .join("");
    filterBar.innerHTML = chips;

    filterBar.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      filterBar.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const tag = chip.dataset.tag;
      const filtered = tag === "All" ? items : items.filter((item) => (item.tags || []).includes(tag));
      renderCards(grid, filtered);
    });
  }

  renderCards(grid, items);
}

/** Fills the footer's email/social links from profile data. Shared by every page. */
function populateFooter() {
  const profile = (window.PORTFOLIO_DATA || {}).profile || {};

  const emailLink = document.getElementById("profile-email");
  if (emailLink && profile.email) {
    emailLink.textContent = profile.email;
    emailLink.href = `mailto:${profile.email}`;
  }

  const email2Link = document.getElementById("profile-email-2");
  if (email2Link) {
    if (profile.secondaryEmail) {
      email2Link.textContent = profile.secondaryEmail;
      email2Link.href = `mailto:${profile.secondaryEmail}`;
    } else {
      email2Link.style.display = "none";
    }
  }

  const waLink = document.getElementById("profile-whatsapp");
  if (waLink) {
    if (profile.whatsapp) {
      waLink.href = `https://wa.me/${profile.whatsapp}`;
    } else {
      waLink.style.display = "none";
    }
  }

  const socials = { github: "profile-github", linkedin: "profile-linkedin", twitter: "profile-twitter" };
  Object.entries(socials).forEach(([key, id]) => {
    const el = document.getElementById(id);
    const url = profile.links && profile.links[key];
    if (el) {
      if (url) el.href = url;
      else el.style.display = "none";
    }
  });
}

function initHomePage() {
  const data = window.PORTFOLIO_DATA || {};
  const categories = ["engineering", "digital", "academics", "awards"];

  categories.forEach((key) => {
    const el = document.getElementById(`count-${key}`);
    if (el) el.textContent = (data[key] || []).length;
  });

  const featured = categories.flatMap((key) => data[key] || []).filter((item) => item.featured);
  renderCards(document.getElementById("featured-grid"), featured);

  const profile = data.profile || {};
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el && value) el.textContent = value;
  };
  setText("profile-name", profile.name);
  setText("profile-title", profile.title);
  setText("profile-tagline", profile.tagline);
  setText("profile-bio", profile.bio);
  setText("profile-location", profile.location);

  document.title = profile.name && profile.name !== "[Your Name]" ? `${profile.name} — Portfolio` : document.title;
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  populateFooter();
  const page = document.body.dataset.page;
  if (page === "home") initHomePage();
  else if (page) initCategoryPage(page);

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
