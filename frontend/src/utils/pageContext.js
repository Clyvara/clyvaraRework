// src/utils/pageContext.js
function regionFromRect(rect, vw, vh) {
    const x = (rect.left + rect.right) / 2 / vw;
    const y = (rect.top + rect.bottom) / 2 / vh;
    const horiz = x < 0.33 ? "left" : x > 0.66 ? "right" : "center";
    const vert  = y < 0.33 ? "top" : y > 0.66 ? "bottom" : "middle";
    return `${vert}-${horiz}`;
  }
  
  export function buildDomManifest() {
    if (typeof window === "undefined" || !document) return null;
  
    const vw = window.innerWidth || document.documentElement.clientWidth;
    const vh = window.innerHeight || document.documentElement.clientHeight;
  
    const candidates = Array.from(document.querySelectorAll(`
      a, button, [role="button"], input[type="submit"], [data-qa]
    `));
  
    const elements = candidates
      .filter(el => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.visibility !== "hidden" &&
               style.display !== "none" &&
               rect.width > 0 && rect.height > 0;
      })
      .slice(0, 200)
      .map(el => {
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          text: (el.getAttribute("data-qa-text") || el.innerText || el.value || "").trim().slice(0, 80),
          ariaLabel: (el.getAttribute("aria-label") || "").trim(),
          href: el.tagName.toLowerCase() === "a" ? (el.getAttribute("href") || "") : "",
          id: el.id || "",
          classes: el.className || "",
          dataQa: el.getAttribute("data-qa") || "",
          region: regionFromRect(rect, vw, vh),
        };
      });
  
    const headings = Array.from(document.querySelectorAll("h1,h2,h3"))
      .slice(0, 12)
      .map(h => ({ tag: h.tagName.toLowerCase(), text: (h.innerText||"").trim().slice(0,120) }));
  
    return {
      url: location.href,
      title: document.title,
      headings,
      elements
    };
  }
  
  // Keep it short: prioritize nav/auth items; if none, return first N
  export function summarizePageContext(ctx, limit = 24) {
    if (!ctx) return null;
    const summary = {
      url: ctx.url,
      title: ctx.title,
      headings: ctx.headings?.slice(0, 8) || [],
      elements: []
    };
    const priorityWords = new Set(["login","log in","signin","sign in","sign-in","logout","sign out","register","sign up","profile","account","menu","pricing","help","docs","dashboard"]);
    for (const el of ctx.elements || []) {
      const text = (el.text || el.ariaLabel || "").toLowerCase();
      if (el.dataQa || [...priorityWords].some(w => text.includes(w))) {
        summary.elements.push(el);
        if (summary.elements.length >= limit) break;
      }
    }
    if (summary.elements.length === 0) {
      summary.elements = (ctx.elements || []).slice(0, limit);
    }
    return summary;
  }
  