// src/scripts/search.js

const modal = document.getElementById("search-modal");
const openBtn = document.getElementById("open-search");
const closeBtn = document.getElementById("close-search");
const input = document.getElementById("search-input");
const results = document.getElementById("search-results");

let pagefind;
let debounceTimer;

// --------------------
// Load Pagefind only once
// --------------------

async function initPagefind() {
  if (!pagefind) {
    pagefind = await import("/pagefind/pagefind.js");
  }

  return pagefind;
}

// --------------------
// Open Search
// --------------------

async function openSearch() {
document.body.classList.remove("overflow-hidden");
  modal?.classList.add("active");
  document.body.classList.add("overflow-hidden");

  input?.focus();

  await initPagefind();
}

// --------------------
// Close Search
// --------------------

function closeSearch() {
  modal?.classList.remove("active");

  if (input) {
    input.value = "";
  }

  if (results) {
    results.innerHTML = "";
  }
}

openBtn?.addEventListener("click", openSearch);

closeBtn?.addEventListener("click", closeSearch);

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSearch();
  }
});

// Close when clicking outside

modal?.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeSearch();
  }
});

// --------------------
// Search
// --------------------

input?.addEventListener("input", () => {

  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(async () => {

    const query = input.value.trim();
    results.innerHTML = `
  <div class="search-loading">
      Searching...
  </div>
`;

    if (!query) {
      results.innerHTML = "";
      return;
    }

    const pf = await initPagefind();

    const search = await pf.search(query);

    const data = await Promise.all(
      search.results.slice(0, 8).map((r) => r.data())
    );

    if (!data.length) {

      results.innerHTML = `
        <p class="no-results">
          No articles found.
        </p>
      `;

      return;
    }
saveRecentSearch(query);
    results.innerHTML = data.map(item => `
      <a class="search-result" href="${item.url}">
        <h3>${item.meta.title}</h3>
        <p>${item.excerpt}</p>
      </a>
    `).join("");

  }, 250);

});

// --------------------
// Ctrl + K Shortcut
// --------------------

window.addEventListener("keydown", (e) => {

  const isMac = navigator.platform.toUpperCase().includes("MAC");

  if (
    (isMac && e.metaKey && e.key.toLowerCase() === "k") ||
    (!isMac && e.ctrlKey && e.key.toLowerCase() === "k")
  ) {
    e.preventDefault();

    if (modal?.classList.contains("active")) {
      closeSearch();
    } else {
      openSearch();
    }
  }

});

// --------------------
// Focus Trap
// --------------------

modal?.addEventListener("keydown", (e) => {

  if (e.key !== "Tab") return;

  const focusable = modal.querySelectorAll(
    'button,input,a,[tabindex]:not([tabindex="-1"])'
  );

  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey) {

    if (document.activeElement === first) {

      e.preventDefault();

      last.focus();

    }

  } else {

    if (document.activeElement === last) {

      e.preventDefault();

      first.focus();

    }

  }

});

function saveRecentSearch(query){

    let history =
        JSON.parse(
            localStorage.getItem("recent-searches") || "[]"
        );

    history = history.filter(item => item !== query);

    history.unshift(query);

    history = history.slice(0,5);

    localStorage.setItem(
        "recent-searches",
        JSON.stringify(history)
    );

}