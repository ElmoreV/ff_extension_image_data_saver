// background.js

/////////
/// Extension state manager
//////////

let enabled = true; // default ON. Change to false if you prefer OFF by default.

async function loadState() {
  try {
    const stored = await browser.storage.local.get("enabled");
    if (typeof stored.enabled === "boolean") enabled = stored.enabled;
  } catch (e) {
    // ignore; keep default
  }
  updateBadge();
}

function updateBadge() {
  const text = enabled ? "ON" : "OFF";
  browser.action.setBadgeText({ text });
  // Optional: make it easier to read
  browser.action.setBadgeBackgroundColor({ color: enabled ? "#3c873a" : "#777777" });
  browser.action.setTitle({ title: `Block images: ${enabled ? "ON" : "OFF"}` });
}


// Toggle on toolbar click
browser.action.onClicked.addListener(async () => {
  enabled = !enabled;
  await browser.storage.local.set({ enabled });
  updateBadge();
});

////////
/// Actual blocking and unblocking
////////
// URLs allowed exactly once after a user click
const allowOnce = new Set();

browser.runtime.onMessage.addListener((msg) => {
    if (msg && msg.type === "allow-image" && typeof msg.url === "string"){
        allowOnce.add(msg.url);
        // failsafe
        setTimeout(() => {
            allowOnce.delete(msg.url);
        }, 15000);
        return Promise.resolve({ok:true});
    }
    return false;
});

function onBeforeRequest(details) {
  if (!enabled) return {};
  // Let it through if the URL was explicitly allowed by a user click
  if (allowOnce.has(details.url)) {
    allowOnce.delete(details.url); // allow only once
    return {};
  }
  // When enabled, cancel all image requests (incl. <img>, CSS backgrounds, favicons).
  return { cancel: true };
}


// Install the blocking listener once; gate behavior via `enabled`
browser.webRequest.onBeforeRequest.addListener(
  onBeforeRequest,
  { urls: ["<all_urls>"], types: ["image","imageset"] },
  ["blocking"]
);



// Initialize state on load and on browser start/install
loadState();
browser.runtime.onStartup.addListener(loadState);
browser.runtime.onInstalled.addListener(loadState);

