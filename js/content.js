// Runs on every page; marks images that failed due to blocking
// and lets the user click to load a single image.

(function () {
  // Inject minimal styles for "blocked" placeholders
  const style = document.createElement("style");
  style.textContent = `
    .idl-blocked-img {
      position: relative;
      background: repeating-linear-gradient(45deg,#eee,#eee 10px,#f7f7f7 10px,#f7f7f7 20px);
    }
    .idl-blocked-img::after {
      content: "🖼  click to load";
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font: 600 12px/1.2 system-ui, sans-serif;
      text-align: center;
      padding: 6px;
      background: rgba(255,255,255,0.8);
      border: 1px dashed #aaa;
      border-radius: 6px;
      margin: 2px;
      pointer-events: none;
    }
    .idl-blocked-img,
    .idl-blocked-img * { cursor: pointer !important; }
  `;
  document.documentElement.appendChild(style);

  function markBlocked(img) {
    if (img.dataset.idlInit === "1") return; // only once
    img.dataset.idlInit = "1";

    // Remember the original src/srcset the page intended to load
    const origSrc = img.getAttribute("src") || "";
    const origSrcset = img.getAttribute("srcset") || "";
    if (!origSrc && !origSrcset) return;

    img.classList.add("idl-blocked-img");

    // When it eventually loads (after we allow it), clean up the styling
    img.addEventListener("load", () => {
      img.classList.remove("idl-blocked-img");
    }, { once: true });

    // Click-to-load: ask background to allow this URL once, then retry
    img.addEventListener("click", async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      // Pick the concrete URL the browser would fetch
      // Prefer currentSrc if available; fall back to src attribute
      const chosen = img.currentSrc || origSrc;
      if (!chosen) return;

      try {
        const resp = await browser.runtime.sendMessage({ type: "allow-image", url: chosen });
        if (resp && resp.ok) {
          // Force a re-request of the image:
          // reset attributes briefly, then restore.
          const s = img.getAttribute("src");
          const ss = img.getAttribute("srcset");

          // Clear then restore to force reload
          if (ss) img.setAttribute("srcset", "");
          if (s) img.setAttribute("src", "");

          // Yield to event loop so the browser notices the change
          setTimeout(() => {
            if (ss) img.setAttribute("srcset", origSrcset);
            if (s || !ss) img.setAttribute("src", origSrc || chosen);
          }, 0);
        }
      } catch (e) {
        // ignore
      }
    }, { passive: false });
  }

  function consider(img) {
    // Skip images that are already loaded successfully
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) return;

    // If the page intended to load something (src/srcset present)
    if (img.getAttribute("src") || img.getAttribute("srcset")) {
      markBlocked(img);
    }
  }

  // Initial pass
  document.querySelectorAll("img").forEach(consider);

  // Watch for images added later (lazy-loaded / infinite scroll)
  const mo = new MutationObserver((records) => {
    for (const r of records) {
      r.addedNodes.forEach((n) => {
        if (n.nodeName === "IMG") consider(n);
        else if (n.nodeType === 1) n.querySelectorAll?.("img").forEach(consider);
      });
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // Also catch images that error out (canceled requests emit 'error')
  window.addEventListener("error", (ev) => {
    const t = ev.target;
    if (t && t.tagName === "IMG") consider(t);
  }, true);
})();