// src/scripts/search.js

const modal = document.getElementById("search-modal");
const openBtn = document.getElementById("open-search");
const closeBtn = document.getElementById("close-search");
const input = document.getElementById("search-input");
const results = document.getElementById("search-results");

// Pagefind ko load karne ka function
let pagefind;

async function initPagefind() {
    if (!pagefind) {
        pagefind = await import("/pagefind/pagefind.js");
    }
}

// --------------------
// Open / Close
// --------------------

openBtn?.addEventListener("click", async () => {
    modal.classList.add("active");
    input.focus();
    // Jaise hi modal khule, pagefind load kar lo
    await initPagefind();
});

closeBtn?.addEventListener("click", () => {
    modal.classList.remove("active");
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        modal.classList.remove("active");
    }
});

// --------------------
// Search Logic
// --------------------

input?.addEventListener("input", async (e) => {
    const query = e.target.value.trim();

    if (!query) {
        results.innerHTML = "";
        return;
    }

    // Pehle ensure karo ki pagefind loaded hai
    await initPagefind();

    const search = await pagefind.search(query);

    const data = await Promise.all(
        search.results.slice(0, 8).map(r => r.data())
    );

    if (data.length === 0) {
        results.innerHTML = `<p class="no-results" style="padding:10px;">No articles found.</p>`;
        return;
    }

    results.innerHTML = data.map(item => `
        <a class="search-result" href="${item.url}" style="display:block; padding:15px; border-bottom:1px solid #eee; text-decoration:none; color:black;">
            <h3 style="margin:0 0 5px 0; font-size:18px;">${item.meta.title}</h3>
            <p style="margin:0; font-size:14px; color:#555;">${item.excerpt}</p>
        </a>
    `).join("");
});