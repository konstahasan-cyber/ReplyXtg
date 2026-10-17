/* Aurelia Grove — plain-HTML build. All interactivity without a framework, so the site works from file:// */
(function () {
  "use strict";
  var DATA = /*__DATA__*/null;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var store = {
    get: function (k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } },
  };
  function track(event, params) {
    window.dataLayer = window.dataLayer || [];
    var p = { event: event, is_test: true, page_path: location.pathname.split("/").pop() || "index.html" };
    for (var k in params || {}) p[k] = params[k];
    window.dataLayer.push(p);
  }
  function saveDemoLead(entry) {
    var list = store.get("ag_demo_leads", []);
    entry.savedAt = new Date().toISOString();
    list.push(entry);
    store.set("ag_demo_leads", list.slice(-20));
  }
  var uid = function () { return "ag" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); };

  /* ── Shared markup (classes mirror the React components so the compiled CSS applies) ── */
  var ARROW = '<svg viewBox="0 0 24 12" class="h-3 w-6 shrink-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5 " aria-hidden="true"><path d="M0 6h22M17 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>';
  var BTN = "group inline-flex min-h-12 items-center justify-center gap-3 px-7 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.14em] transition-[background-color,color,border-color] duration-300 disabled:cursor-not-allowed disabled:opacity-60 ";
  var BTN_PRIMARY = BTN + "bg-forest text-ivory hover:bg-forest-deep";
  var BTN_OUTLINE = BTN + "border border-forest/40 text-forest hover:border-forest hover:bg-forest hover:text-ivory";
  var INPUT = "block w-full border-0 border-b bg-transparent px-0 py-3 text-[1.02rem] text-charcoal placeholder:text-muted/80 transition-colors focus:outline-none focus:ring-0 focus-visible:outline-none ";
  var INPUT_OK = "border-forest/30 focus:border-forest";
  var INPUT_ERR = "border-red-700";
  var LABEL = "text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-stone";
  var CHECK = "mt-1 h-5 w-5 shrink-0 cursor-pointer appearance-none border border-forest/50 bg-white bg-center bg-no-repeat checked:border-forest checked:bg-forest checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2016%2016%22%3E%3Cpath%20d=%22M3.5%208.5l3%203%206-6%22%20fill=%22none%22%20stroke=%22white%22%20stroke-width=%222%22/%3E%3C/svg%3E')]";
  var CHOICE = "relative flex min-h-12 cursor-pointer items-center border border-line bg-white px-4 py-2.5 text-sm text-charcoal transition-colors hover:border-forest/60 has-[:checked]:border-forest has-[:checked]:bg-forest has-[:checked]:text-ivory has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terracotta";
  var DEMO_BADGE = '<p class="inline-flex items-center gap-2 bg-forest px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ivory" role="status"><span class="h-1.5 w-1.5 rounded-full bg-terracotta" aria-hidden="true"></span>Demo submission saved locally</p>';
  var ERR_ICON = '<svg viewBox="0 0 16 16" class="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.4"></circle><path d="M8 4.5v4.2M8 11v.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path></svg>';

  function textField(o) {
    var id = o.id || uid();
    return '<div class="' + (o.cls || "") + '"><label for="' + id + '" class="flex items-baseline justify-between ' + LABEL + '"><span>' + esc(o.label) + "</span>" +
      (o.optional ? '<span class="font-medium normal-case tracking-normal text-stone">Optional</span>' : "") + "</label>" +
      '<input id="' + id + '" name="' + o.name + '" type="' + (o.type || "text") + '"' + (o.attrs || "") + ' value="' + esc(o.value || "") + '" class="' + INPUT + INPUT_OK + ' focus:shadow-[0_1px_0_0_var(--color-forest)]">' +
      '<p data-hint class="mt-2 text-sm text-stone"' + (o.hint ? "" : " hidden") + ">" + esc(o.hint || "") + "</p></div>";
  }
  function choiceGroup(name, legend, options, value, cols) {
    return '<fieldset><legend class="' + LABEL + '">' + esc(legend) + '</legend><div class="mt-3 grid gap-2 ' + (cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2") + '">' +
      options.map(function (o) {
        return '<label class="' + CHOICE + '"><input type="radio" name="' + name + '" value="' + o.value + '" class="sr-only"' + (value === o.value ? " checked" : "") + ">" + esc(o.label) + "</label>";
      }).join("") + "</div></fieldset>";
  }
  function setError(input, msg) {
    var wrap = input.type === "checkbox" ? input.closest("div").parentElement : input.parentElement;
    var old = $("[data-err]", wrap);
    if (old) old.remove();
    input.removeAttribute("aria-invalid");
    if (input.type !== "checkbox" && input.type !== "radio") {
      input.className = input.className.replace(INPUT_ERR, "").replace(INPUT_OK, "").trim() + " " + (msg ? INPUT_ERR : INPUT_OK);
    }
    var hint = $("[data-hint]", wrap);
    if (!msg) { if (hint && hint.textContent) hint.hidden = false; return; }
    if (hint) hint.hidden = true;
    input.setAttribute("aria-invalid", "true");
    var p = document.createElement("p");
    p.setAttribute("data-err", "");
    p.setAttribute("role", "alert");
    p.className = "mt-2 flex items-start gap-2 text-sm font-medium text-red-800";
    p.innerHTML = ERR_ICON + esc(msg);
    wrap.appendChild(p);
  }
  var validators = {
    name: function (v) { v = v.trim(); return v.length < 2 ? "Please enter your name." : v.length > 80 ? "Please keep your name under 80 characters." : ""; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address, like name@example.com."; },
    phone: function (v) { return v.trim() === "" || v.replace(/\D/g, "").length >= 10 ? "" : "Please enter a 10-digit phone number, or leave this blank."; },
    zip: function (v) { return /^\d{5}$/.test(v.trim()) ? "" : "Please enter a 5-digit ZIP code."; },
    message: function (v) { v = v.trim(); return v.length < 10 ? "Tell us a little about your project (at least 10 characters)." : v.length > 2000 ? "Please keep your message under 2,000 characters." : ""; },
    consent: function (v, el) { return el.checked ? "" : "Please confirm you agree to be contacted about your project."; },
  };
  function validate(form, names) {
    var first = null;
    names.forEach(function (n) {
      var el = form.elements[n];
      if (!el) return;
      var msg = validators[n](el.value || "", el);
      setError(el, msg);
      if (msg && !first) first = el;
    });
    if (first) first.focus();
    return !first;
  }
  // Errors clear while typing (so the layout is settled before the next click); new errors appear on blur.
  function liveValidate(el, n) {
    var check = function () { if (el.getAttribute("aria-invalid")) setError(el, validators[n](el.value || "", el)); };
    el.addEventListener("input", check);
    el.addEventListener("change", check);
    el.addEventListener("blur", function () { if (el.value && el.type !== "checkbox" && !el.getAttribute("aria-invalid")) setError(el, validators[n](el.value, el)); });
  }
  var isServiceZip = function (z) { return /^95[678]/.test(z); };

  /* ── Header: transparent → solid on scroll, services dropdown, mobile menu ── */
  var header = $(".site-header");
  var transparentHeader = header && header.classList.contains("bg-transparent");
  var menuOpen = false;
  function syncHeader() {
    if (!transparentHeader) return;
    var solid = window.scrollY > 40 || menuOpen;
    header.classList.toggle("is-solid", solid);
    header.classList.toggle("on-dark", !solid);
  }
  window.addEventListener("scroll", syncHeader, { passive: true });
  syncHeader();

  var svcBtn = $('[aria-controls="services-menu"]');
  var svcMenu = $("#services-menu");
  if (svcBtn && svcMenu) {
    var li = svcBtn.parentElement;
    var setSvc = function (open) {
      svcMenu.hidden = !open;
      svcBtn.setAttribute("aria-expanded", String(open));
      var chev = $("svg", svcBtn);
      if (chev) chev.classList.toggle("rotate-180", open);
    };
    svcBtn.addEventListener("click", function () { setSvc(svcMenu.hidden); });
    li.addEventListener("mouseenter", function () { setSvc(true); });
    li.addEventListener("mouseleave", function () { setSvc(false); });
    document.addEventListener("click", function (e) { if (!li.contains(e.target)) setSvc(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setSvc(false); });
  }

  var menuBtn = $('[aria-controls="mobile-menu"]');
  var menu = $("#mobile-menu");
  if (menuBtn && menu) {
    var bars = $$("span", menuBtn);
    var setMenu = function (open) {
      menuOpen = open;
      menu.hidden = !open;
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (bars[0]) { bars[0].classList.toggle("rotate-45", open); bars[0].classList.toggle("-translate-y-1.5", !open); }
      if (bars[1]) { bars[1].classList.toggle("-rotate-45", open); bars[1].classList.toggle("translate-y-1.5", !open); }
      document.body.style.overflow = open ? "hidden" : "";
      syncHeader();
      if (open) { var a = $("a", menu); if (a) a.focus(); }
    };
    menuBtn.addEventListener("click", function () { setMenu(!menuOpen); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menuOpen) { setMenu(false); menuBtn.focus(); } });
  }

  /* ── Scroll reveal ── */
  document.documentElement.classList.add("js");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting || e.boundingClientRect.top < 0) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    var observeAll = function () { $$("[data-reveal]:not(.is-visible)").forEach(function (el) { io.observe(el); }); };
    observeAll();
    window.__agObserve = observeAll;
  } else {
    $$("[data-reveal]").forEach(function (el) { el.classList.add("is-visible"); });
    window.__agObserve = function () { $$("[data-reveal]").forEach(function (el) { el.classList.add("is-visible"); }); };
  }

  /* ── Tracked links ── */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (href.indexOf("tel:") === 0) track("phone_click", {});
    else if (href.indexOf("mailto:") === 0) track("email_click", {});
    else if (/planner\.html|contact\.html/.test(href) && /uppercase/.test(a.className)) track("primary_cta_click", { label: a.textContent.trim() });
  });

  /* ── Accordions (FAQ) ── */
  $$('button[aria-expanded][aria-controls]').forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel || panel.getAttribute("role") !== "region") return;
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") !== "true";
      var group = btn.parentElement.parentElement.parentElement;
      $$('button[aria-expanded][aria-controls]', group).forEach(function (b) {
        var p = document.getElementById(b.getAttribute("aria-controls"));
        if (!p || p.getAttribute("role") !== "region") return;
        var on = b === btn && open;
        b.setAttribute("aria-expanded", String(on));
        p.classList.toggle("grid-rows-[1fr]", on);
        p.classList.toggle("grid-rows-[0fr]", !on);
        var inner = p.firstElementChild;
        if (inner) { if (on) inner.removeAttribute("inert"); else inner.setAttribute("inert", ""); }
        var icon = $("span[aria-hidden] span:last-child", b);
        if (icon) icon.classList.toggle("scale-y-0", on);
      });
      if (open) track("faq_expand", { question: btn.textContent.trim() });
    });
  });

  /* ── Process timeline (tabs) ── */
  var tablist = $('[role="tablist"][aria-label="Building process steps"]');
  if (tablist && DATA) {
    var steps = DATA.processSteps;
    var root = tablist.parentElement.parentElement;
    var active = 0;
    var renderProcess = function (focus) {
      var pct = (active / (steps.length - 1)) * 100;
      var tabs = steps.map(function (s, i) {
        var sel = i === active, done = i < active;
        return '<button role="tab" id="process-tab-' + i + '" aria-selected="' + sel + '" aria-controls="process-panel" tabindex="' + (sel ? 0 : -1) + '" data-i="' + i + '" class="group flex items-center gap-4 p-3 text-left transition-colors lg:flex-col lg:items-start lg:gap-5 lg:p-0 lg:pr-4 ' + (sel ? "bg-sand/70 lg:bg-transparent" : "") + '">' +
          '<span class="relative z-10 flex h-[2.3rem] w-[2.3rem] shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors duration-300 ' + (sel || done ? "border-terracotta bg-terracotta text-white" : "border-line bg-ivory text-stone group-hover:border-forest") + '">' + s.number + "</span>" +
          '<span class="font-serif text-[1.3rem] leading-tight transition-colors ' + (sel ? "text-forest" : "text-stone group-hover:text-forest") + '">' + esc(s.title) + "</span></button>";
      }).join("");
      var s = steps[active];
      var list = function (title, items) {
        return '<div class="border-l pl-6 border-line"><h4 class="eyebrow text-stone">' + title + '</h4><ul class="mt-4 space-y-2 text-charcoal">' + items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
      };
      root.children[0].innerHTML =
        '<div class="absolute left-0 right-0 top-[1.15rem] hidden h-px lg:block bg-line" aria-hidden="true"></div>' +
        '<div class="absolute left-0 top-[1.15rem] hidden h-px bg-terracotta transition-[width] duration-700 ease-[var(--ease-out-expo)] lg:block" style="width:' + pct + '%" aria-hidden="true"></div>' +
        '<div role="tablist" aria-label="Building process steps" class="relative grid gap-2 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">' + tabs + "</div>";
      var panel = document.createElement("div");
      panel.id = "process-panel";
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", "process-tab-" + active);
      panel.tabIndex = 0;
      panel.className = "mt-10 grid animate-[page-in_0.5s_var(--ease-out-quart)_both] gap-10 border-t pt-10 md:grid-cols-12 border-line";
      panel.innerHTML =
        '<div class="md:col-span-6"><p class="eyebrow text-clay">Step ' + s.number + " of " + String(steps.length).padStart(2, "0") + "</p>" +
        '<h3 class="mt-4 text-h3 text-forest">' + esc(s.title) + '</h3><p class="mt-4 text-lede text-charcoal">' + esc(s.summary) + "</p>" +
        '<ul class="mt-6 space-y-3 text-stone">' + s.details.map(function (d) { return '<li class="flex gap-3 leading-relaxed"><span aria-hidden="true" class="mt-[0.7em] h-px w-4 shrink-0 bg-terracotta"></span>' + esc(d) + "</li>"; }).join("") + "</ul></div>" +
        '<div class="grid gap-8 sm:grid-cols-2 md:col-span-5 md:col-start-8 md:grid-cols-1">' + list("What you'll provide", s.youProvide) + list("Typical outcomes", s.typicalOutputs) + "</div>" +
        '<div class="flex items-center justify-between gap-4 md:col-span-12"><button type="button" data-step="-1" class="text-xs font-semibold uppercase tracking-[0.14em] disabled:opacity-30 text-forest"' + (active === 0 ? " disabled" : "") + '>← Previous step</button>' +
        '<button type="button" data-step="1" class="text-xs font-semibold uppercase tracking-[0.14em] disabled:opacity-30 text-forest"' + (active === steps.length - 1 ? " disabled" : "") + ">Next step →</button></div>";
      root.replaceChild(panel, root.children[1]);
      if (focus) { var t = document.getElementById("process-tab-" + active); if (t) t.focus(); }
    };
    root.addEventListener("click", function (e) {
      var tab = e.target.closest('[role="tab"]');
      var stepBtn = e.target.closest("[data-step]");
      if (tab) { active = +tab.getAttribute("data-i"); renderProcess(true); }
      else if (stepBtn && !stepBtn.disabled) { active = Math.min(steps.length - 1, Math.max(0, active + +stepBtn.getAttribute("data-step"))); renderProcess(false); }
    });
    root.addEventListener("keydown", function (e) {
      if (!e.target.closest('[role="tab"]')) return;
      var last = steps.length - 1, next = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = active === last ? 0 : active + 1;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = active === 0 ? last : active - 1;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = last;
      if (next === null) return;
      e.preventDefault();
      active = next;
      renderProcess(true);
    });
    renderProcess(false);
  }

  /* ── Project gallery lightbox ── */
  var galleryButtons = $$('button[aria-label^="Open image"]');
  var dialog = galleryButtons.length ? galleryButtons[0].closest("ul").nextElementSibling : null;
  if (dialog && dialog.tagName === "DIALOG") {
    var imgs = galleryButtons.map(function (b) {
      var img = $("img", b);
      return { src: img.getAttribute("src"), alt: img.getAttribute("alt"), caption: b.getAttribute("aria-label").replace(/^[^:]*:\s*/, "") };
    });
    var gi = 0;
    var renderGallery = function () {
      var im = imgs[gi];
      var nav = "border border-ivory/30 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-ivory hover:text-charcoal";
      dialog.innerHTML = '<div class="flex h-full flex-col"><div class="flex items-center justify-between px-5 py-4 text-sm"><p aria-live="polite">' + (gi + 1) + " / " + imgs.length + ' · <span class="text-ivory/70">' + esc(im.caption) + '</span></p><button type="button" data-close class="-m-2 p-2 text-3xl leading-none" aria-label="Close gallery">×</button></div>' +
        '<div class="relative flex-1"><img src="' + im.src + '" alt="' + esc(im.alt) + '" class="animate-[page-in_0.4s_ease_both] object-contain" style="position:absolute;inset:0;width:100%;height:100%"></div>' +
        '<div class="flex items-center justify-between px-5 py-5"><button type="button" data-nav="-1" class="' + nav + '">← Previous</button><p class="hidden text-xs uppercase tracking-[0.16em] text-ivory/50 sm:block">Concept rendering — not a completed home</p><button type="button" data-nav="1" class="' + nav + '">Next →</button></div></div>';
    };
    galleryButtons.forEach(function (b, i) {
      b.addEventListener("click", function () { gi = i; renderGallery(); dialog.showModal(); });
    });
    dialog.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) dialog.close();
      var n = e.target.closest("[data-nav]");
      if (n) { gi = (gi + +n.getAttribute("data-nav") + imgs.length) % imgs.length; renderGallery(); }
    });
    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { gi = (gi + (e.key === "ArrowRight" ? 1 : -1) + imgs.length) % imgs.length; renderGallery(); }
    });
    track("project_view", { project: location.pathname.split("/").pop() });
  }

  /* ── Mobile bottom CTA bar ── */
  var bar = $("[data-mobile-cta]");
  if (bar) {
    var syncBar = function () {
      var nearBottom = window.innerHeight + window.scrollY > document.body.scrollHeight - 520;
      var vis = window.scrollY > window.innerHeight * 0.7 && !nearBottom;
      bar.classList.toggle("translate-y-0", vis);
      bar.classList.toggle("translate-y-full", !vis);
      bar.setAttribute("aria-hidden", String(!vis));
      if (vis) bar.removeAttribute("inert"); else bar.setAttribute("inert", "");
    };
    window.addEventListener("scroll", syncBar, { passive: true });
    syncBar();
  }

  /* ── Home: planner teaser starts the planner pre-filled ── */
  if (DATA) {
    $$("fieldset button").forEach(function (b) {
      var label = $("span", b);
      var opt = label && DATA.planner.projectTypes.filter(function (o) { return o.label === label.textContent.trim(); })[0];
      if (!opt) return;
      b.addEventListener("click", function () { track("primary_cta_click", { location: "planner_teaser", label: opt.value }); location.href = "planner.html?type=" + opt.value; });
    });
  }

  /* ── Contact: two-stage consultation form ── */
  var cform = $("form textarea[name=message]");
  cform = cform && cform.closest("form");
  if (cform) {
    cform.setAttribute("novalidate", "");
    var draft = store.get("ag_consult_draft", {});
    ["name", "email", "phone", "message"].forEach(function (n) { if (draft[n] && cform.elements[n]) cform.elements[n].value = draft[n]; });
    var started = false;
    cform.addEventListener("input", function () {
      if (!started) { started = true; track("consultation_form_start", {}); }
      store.set("ag_consult_draft", { name: cform.elements.name.value, email: cform.elements.email.value, phone: cform.elements.phone.value, message: cform.elements.message.value });
    });
    ["name", "email", "phone", "message", "consent"].forEach(function (n) {
      var el = cform.elements[n];
      if (el) liveValidate(el, n);
    });
    cform.addEventListener("submit", function (e) {
      e.preventDefault();
      if (cform.elements.website && cform.elements.website.value) return;
      if (!validate(cform, ["name", "email", "phone", "message", "consent"])) { track("consultation_form_error", {}); return; }
      var contact = { name: cform.elements.name.value.trim(), email: cform.elements.email.value.trim(), phone: cform.elements.phone.value.trim(), message: cform.elements.message.value.trim() };
      var leadId = uid();
      saveDemoLead({ id: leadId, kind: "consultation", contact: contact });
      store.del("ag_consult_draft");
      track("consultation_form_submit", {});
      var first = esc(contact.name.split(" ")[0]);
      var P = DATA.planner;
      var q = document.createElement("form");
      q.setAttribute("novalidate", "");
      q.className = "animate-[page-in_0.5s_ease_both]";
      q.innerHTML = DEMO_BADGE + '<h2 tabindex="-1" class="mt-5 text-h3 text-forest outline-none">Thanks, ' + first + " — your message is in.</h2>" +
        '<p class="mt-3 leading-relaxed text-stone">Want a more useful first conversation? Answer any of these <strong class="font-semibold text-charcoal">optional</strong> questions. Skip whatever you like.</p>' +
        '<div class="mt-8 space-y-7">' + choiceGroup("land", "Do you own land?", P.landStatuses) + choiceGroup("timeline", "When would you like to begin?", P.timelines) +
        choiceGroup("budget", "Planning budget (your estimate, not a quote)", P.budgets) +
        '<div class="grid gap-7 sm:grid-cols-2">' + textField({ label: "ZIP code", name: "zip", optional: true, attrs: ' inputmode="numeric" maxlength="5"' }) + choiceGroup("method", "Preferred contact", P.contactMethods, null, 3) + "</div></div>" +
        '<div class="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"><button type="submit" class="' + BTN_PRIMARY + '"><span>Add These Details</span>' + ARROW + '</button><button type="button" data-skip class="text-xs font-semibold uppercase tracking-[0.14em] text-forest underline-offset-4 hover:underline sm:ml-4">Skip for now</button></div>';
      cform.replaceWith(q);
      $("h2", q).focus();
      var done = function () {
        var d = document.createElement("div");
        d.className = "animate-[page-in_0.5s_ease_both]";
        d.setAttribute("role", "status");
        d.innerHTML = DEMO_BADGE + '<h2 tabindex="-1" class="mt-5 text-h3 text-forest outline-none">Thank you, ' + first + ". You're all set.</h2>" +
          '<p class="mt-4 leading-relaxed text-stone">In a live site, the team would reply using your preferred contact method. This demo did not send your message anywhere.</p>' +
          '<div class="mt-8 flex flex-wrap gap-6 text-xs font-semibold uppercase tracking-[0.14em] text-forest"><a href="process.html" class="link-underline">Understand the Building Process →</a><a href="home-designs.html" class="link-underline">Explore Home Designs →</a></div>';
        q.replaceWith(d);
        $("h2", d).focus();
      };
      var zipInput = q.elements.zip;
      zipInput.addEventListener("input", function () {
        var hint = $("[data-hint]", zipInput.parentElement);
        var z = zipInput.value;
        hint.textContent = z.length === 5 && !isServiceZip(z) ? "Outside our usual region — we'll still read your note." : "";
        hint.hidden = !hint.textContent;
        setError(zipInput, "");
      });
      q.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var z = zipInput.value.trim();
        if (z && !/^\d{5}$/.test(z)) { setError(zipInput, "Please enter a 5-digit ZIP code, or leave it blank."); zipInput.focus(); return; }
        var val = function (n) { var c = $('input[name="' + n + '"]:checked', q); return c ? c.value : undefined; };
        saveDemoLead({ id: leadId, kind: "qualification", details: { landStatus: val("land"), timeline: val("timeline"), budget: val("budget"), zip: z, contactMethod: val("method") } });
        track("qualification_submit", {});
        done();
      });
      $("[data-skip]", q).addEventListener("click", done);
    });
  }

  /* ── Home Planner ── */
  var plannerMount = location.pathname.split("/").pop() === "planner.html" ? $("main .min-h-\\[80svh\\]") : null;
  if (plannerMount && DATA) initPlanner(plannerMount, DATA.planner);

  function initPlanner(mount, P) {
    var steps = [
      { key: "projectType", name: "Project", title: "What are you planning?", intro: "Choose the option closest to where you are today.", options: P.projectTypes },
      { key: "landStatus", name: "Land", title: "Do you already own land?", intro: "It's completely fine if you're still looking — many people start here.", options: P.landStatuses },
      { key: "homeSize", name: "Size", title: "What size home do you have in mind?", intro: "A rough range is all we need. Size is one of the biggest drivers of budget.", options: P.homeSizes },
      { key: "style", name: "Style", title: "Which architectural style feels like home?", intro: "Pick the one that resonates most. Every design is tailored — this is just a starting point.", options: P.homeStyles, images: true },
      { key: "budget", name: "Budget", title: "What is your planning budget?", intro: "Your comfortable range for the home itself, excluding land.", options: P.budgets,
        note: "This is your own planning range — it helps us frame the conversation. It is not a quote or a promise of construction cost, which depends on your lot, design, finishes and local requirements." },
      { key: "timeline", name: "Timeline", title: "When would you like to begin?", intro: "Design and permitting usually come before construction, so earlier conversations help.", options: P.timelines },
    ];
    var TOTAL = 7, KEY = "ag_planner_v1";
    var label = function (opts, v) { var o = opts.filter(function (x) { return x.value === v; })[0]; return o ? o.label : "—"; };
    var st = store.get(KEY, null) || { step: 0, answers: {}, contact: { contactMethod: "email" } };
    st.contact = st.contact || { contactMethod: "email" };
    var typeParam = new URLSearchParams(location.search).get("type");
    if (typeParam && !st.answers.projectType && P.projectTypes.some(function (o) { return o.value === typeParam; })) {
      st.answers.projectType = typeParam; st.step = 1; st.started = true;
      track("planner_start", { source: "teaser" });
      track("planner_step_complete", { step: 1, step_name: "Project", value: typeParam });
    }
    var submitted = null, returnToContact = false, stepError = "", autoTimer = null, pointer = false;
    var save = function () { if (!submitted) store.set(KEY, st); };
    var begin = function () { if (!st.started) { st.started = true; track("planner_start", { source: "planner" }); } };
    window.addEventListener("pagehide", function () { if (st.started && !submitted) track("planner_abandon", { last_step: st.step + 1 }); });

    function nextSteps() {
      var a = st.answers, out = [];
      if (a.landStatus === "yes") out.push("Share your lot address so we can review zoning, setbacks, utilities and orientation.");
      else if (a.landStatus === "buying") out.push("Before closing, consider a feasibility review of the parcel — zoning, utilities, slope and any special zones.");
      else out.push("Start a lot checklist: zoning, utility access, slope, orientation and any HOA or fire-zone requirements.");
      out.push(a.budget === "unsure" ? "Talk through a comfortable budget range — we'll explain the main cost drivers rather than quote a generic price." : "Review how your budget range splits across land costs, design, permits, site work and construction.");
      out.push(a.style === "unsure" ? "Collect 10–15 images of homes and rooms you love; patterns emerge quickly." : "Gather inspiration that captures what draws you to this style — materials, light, rooflines.");
      if (a.projectType === "rebuild") out.push("Note any existing structures, utilities and neighborhood design guidelines that may apply to a rebuild.");
      out.push(a.timeline === "exploring" ? "Read through our building process to see what each phase involves." : "Schedule a discovery conversation to map out a realistic sequence for design, permits and construction.");
      return out.slice(0, 4);
    }

    function sidePanel() {
      var styleImg = (P.homeStyles.filter(function (s) { return s.value === st.answers.style; })[0] || P.homeStyles[0]).image.replace(/^\//, "");
      var items = steps.map(function (s) { return { name: s.name, value: label(s.options, st.answers[s.key]) }; }).concat([{ name: "Contact", value: "" }]);
      return '<aside class="on-dark relative hidden overflow-hidden bg-forest text-ivory lg:col-span-4 lg:block">' +
        '<img src="' + styleImg + '" alt="" class="object-cover opacity-35" style="position:absolute;inset:0;width:100%;height:100%">' +
        '<div class="absolute inset-0 bg-gradient-to-b from-forest/40 via-forest/70 to-forest" aria-hidden="true"></div>' +
        '<div class="relative flex h-full flex-col p-10 xl:p-14"><p class="eyebrow text-clay-light">Home Planner</p><p class="mt-4 font-serif text-4xl leading-tight">Let\'s shape your project.</p>' +
        '<nav aria-label="Planner steps" class="mt-12"><ol class="space-y-1">' + items.map(function (s, i) {
          var done = submitted || i < st.step || (i < TOTAL - 1 && st.answers[steps[i].key]);
          var cur = !submitted && i === st.step;
          var can = !submitted && (i <= st.step || done);
          return '<li><button type="button" data-jump="' + i + '"' + (can ? "" : " disabled") + (cur ? ' aria-current="step"' : "") + ' class="group flex w-full items-center gap-4 py-2.5 text-left disabled:cursor-default">' +
            '<span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[0.7rem] font-semibold ' + (cur ? "border-ivory bg-ivory text-forest" : done ? "border-terracotta bg-terracotta text-white" : "border-ivory/30 text-ivory/60") + '">' + (done && !cur ? "✓" : i + 1) + "</span>" +
            '<span class="min-w-0"><span class="block text-sm font-semibold ' + (cur ? "text-ivory" : "text-ivory/75") + '">' + s.name + "</span>" +
            (done && s.value && s.value !== "—" ? '<span class="block truncate text-xs text-ivory/60 group-enabled:group-hover:text-ivory">' + esc(s.value) + " · Edit</span>" : "") + "</span></button></li>";
        }).join("") + "</ol></nav>" +
        '<p class="mt-auto pt-10 text-xs leading-relaxed text-ivory/60">Your answers are kept in this browser only until you send them. In this demo, nothing is sent to a real company.</p></div></aside>';
    }

    function topBar() {
      var progress = submitted ? 100 : Math.round((st.step / TOTAL) * 100);
      var lbl = submitted ? "Complete" : "Step " + (st.step + 1) + " of " + TOTAL + " · " + (st.step < TOTAL - 1 ? steps[st.step].name : "Contact");
      return '<div class="sticky top-20 z-10 border-b border-line bg-ivory/95 backdrop-blur"><div class="mx-auto flex max-w-3xl items-center justify-between gap-6 px-5 py-4 sm:px-10">' +
        '<p class="text-xs font-semibold uppercase tracking-[0.16em] text-stone" aria-live="polite">' + lbl + "</p>" +
        '<div class="h-1 w-32 bg-line sm:w-56" role="progressbar" aria-label="Planner progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + progress + '"><div class="h-full bg-terracotta transition-[width] duration-700 ease-[var(--ease-out-expo)]" style="width:' + progress + '%"></div></div></div></div>';
    }

    function choiceView(cs, idx) {
      var v = st.answers[cs.key];
      return '<div class="animate-[page-in_0.5s_ease_both]"><p class="eyebrow text-clay">Step ' + (idx + 1) + "</p>" +
        '<h1 tabindex="-1" id="q-' + cs.key + '" class="mt-4 text-h2 text-forest outline-none">' + cs.title + "</h1>" +
        '<p class="mt-4 text-lede text-stone">' + cs.intro + "</p>" +
        '<div role="radiogroup" aria-labelledby="q-' + cs.key + '" class="mt-10 grid gap-3 ' + (cs.images ? "grid-cols-2 md:grid-cols-3" : "sm:grid-cols-2") + '">' +
        cs.options.map(function (o) {
          var on = v === o.value;
          return '<label data-opt class="group relative flex cursor-pointer flex-col overflow-hidden border bg-white text-left transition-[border-color,box-shadow] duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terracotta ' + (on ? "border-forest shadow-[inset_0_0_0_1px_var(--color-forest)]" : "border-line hover:border-forest/50") + '">' +
            '<input type="radio" name="' + cs.key + '" value="' + o.value + '" class="sr-only"' + (on ? " checked" : "") + ">" +
            (cs.images && o.image ? '<span class="relative block aspect-[4/3] overflow-hidden bg-sand"><img src="' + o.image.replace(/^\//, "") + '" alt="" class="object-cover transition-transform duration-700 group-hover:scale-105" style="position:absolute;inset:0;width:100%;height:100%"></span>' : "") +
            '<span class="flex flex-1 items-start justify-between gap-3 ' + (cs.images ? "p-4" : "min-h-20 p-5") + '"><span><span class="block font-semibold text-charcoal">' + esc(o.label) + "</span>" +
            (o.hint ? '<span class="mt-1 block text-sm leading-snug text-stone">' + esc(o.hint) + "</span>" : "") + "</span>" +
            '<span aria-hidden="true" class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ' + (on ? "border-forest bg-forest" : "border-line") + '">' + (on ? '<span class="h-1.5 w-1.5 rounded-full bg-ivory"></span>' : "") + "</span></span></label>";
        }).join("") + "</div>" +
        (cs.note ? '<p class="mt-6 border-l-2 border-terracotta bg-sand/50 px-4 py-3 text-sm leading-relaxed text-charcoal">' + cs.note + "</p>" : "") +
        (stepError ? '<p role="alert" class="mt-6 text-sm font-medium text-red-800">' + stepError + "</p>" : "") +
        '<div class="mt-12 flex items-center justify-between border-t border-line pt-8">' +
        (idx > 0 ? '<button type="button" data-back class="text-xs font-semibold uppercase tracking-[0.14em] text-forest">← Back</button>' : "<span></span>") +
        '<button type="button" data-continue class="' + BTN_PRIMARY + '"><span>Continue</span>' + ARROW + "</button></div></div>";
    }

    function contactView() {
      var c = st.contact;
      var review = steps.map(function (s, i) {
        return '<div class="flex items-baseline justify-between gap-3 border-b border-line/70 py-1.5"><dt class="text-stone">' + s.name + '</dt><dd class="flex items-baseline gap-3 text-right font-medium text-charcoal">' + esc(label(s.options, st.answers[s.key])) +
          '<button type="button" data-edit="' + i + '" class="text-xs font-semibold text-clay underline underline-offset-2">Edit<span class="sr-only"> ' + s.name + "</span></button></dd></div>";
      }).join("");
      var outside = /^\d{5}$/.test(c.zip || "") && !isServiceZip(c.zip);
      return '<form novalidate class="relative animate-[page-in_0.5s_ease_both]"><p class="eyebrow text-clay">Step 7 · Almost done</p>' +
        '<h1 tabindex="-1" class="mt-4 text-h2 text-forest outline-none">Where should we send your project summary?</h1>' +
        '<p class="mt-4 text-lede text-stone">We\'ll use this only to follow up about your home. No newsletters unless you ask.</p>' +
        '<div class="mt-8 bg-sand/50 p-5"><p class="text-xs font-semibold uppercase tracking-[0.14em] text-stone">Your answers</p><dl class="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">' + review + "</dl></div>" +
        '<div class="mt-10 grid gap-8 sm:grid-cols-2">' +
        textField({ label: "Name", name: "name", value: c.name, attrs: ' autocomplete="name"' }) +
        textField({ label: "Email", name: "email", type: "email", value: c.email, attrs: ' autocomplete="email" inputmode="email"' }) +
        textField({ label: "Phone", name: "phone", type: "tel", value: c.phone, optional: true, attrs: ' autocomplete="tel" inputmode="tel"' }) +
        textField({ label: "ZIP code", name: "zip", value: c.zip, attrs: ' autocomplete="postal-code" inputmode="numeric" maxlength="5"',
          hint: outside ? "This looks outside our usual service region — send it anyway and we'll let you know if we can help." : "Where you plan to build, or where you live now." }) +
        '</div><div class="mt-8">' + choiceGroup("contactMethod", "Preferred contact method", P.contactMethods, c.contactMethod || "email", 3) + "</div>" +
        '<div class="mt-8"><div class="flex items-start gap-3"><input id="pl-consent" name="consent" type="checkbox" class="' + CHECK + '">' +
        '<label for="pl-consent" class="cursor-pointer text-sm leading-relaxed text-stone">I agree to be contacted about my project and accept the <a href="privacy.html" target="_blank" class="font-semibold text-forest underline underline-offset-4">Privacy Policy</a>.</label></div></div>' +
        '<p class="mt-8 text-sm text-stone"><strong class="font-semibold text-charcoal">Demo:</strong> your submission is validated and saved locally in this browser. No email is sent and no real company receives it.</p>' +
        '<div class="mt-10 flex flex-col-reverse gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">' +
        '<button type="button" data-back class="text-xs font-semibold uppercase tracking-[0.14em] text-forest">← Back</button>' +
        '<button type="submit" class="' + BTN_PRIMARY + '"><span>See My Project Summary</span>' + ARROW + "</button></div></form>";
    }

    function confirmationView() {
      var a = st.answers, style = label(P.homeStyles, a.style);
      var rows = [["Project type", label(P.projectTypes, a.projectType)], ["Selected style", style], ["Approximate size", label(P.homeSizes, a.homeSize)], ["Budget preference", label(P.budgets, a.budget)]];
      return '<div class="animate-[page-in_0.6s_ease_both]">' + DEMO_BADGE +
        '<h1 tabindex="-1" class="mt-6 text-h2 text-forest outline-none">Thank you, ' + esc(submitted.first) + ". Your " + (a.style === "unsure" ? "custom home" : esc(style)) + " plan is taking shape.</h1>" +
        '<p class="mt-5 text-lede text-stone">In a live site, a project coordinator would review your answers and reply using your preferred contact method. In this demo, nothing was sent.</p>' +
        '<dl class="mt-10 grid gap-px bg-line sm:grid-cols-2">' + rows.map(function (r) { return '<div class="bg-white p-6"><dt class="text-xs font-semibold uppercase tracking-[0.14em] text-stone">' + r[0] + '</dt><dd class="mt-2 font-serif text-2xl text-forest">' + esc(r[1]) + "</dd></div>"; }).join("") + "</dl>" +
        '<h2 class="mt-12 font-serif text-3xl text-forest">Suggested next planning steps</h2><ol class="mt-6 space-y-4">' +
        nextSteps().map(function (s, i) { return '<li class="flex gap-4"><span class="font-serif text-2xl leading-none text-clay">' + (i + 1) + '</span><span class="leading-relaxed text-charcoal">' + s + "</span></li>"; }).join("") + "</ol>" +
        '<div class="mt-12 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center"><button type="button" data-summary class="' + BTN_PRIMARY + '"><span>View My Project Summary</span>' + ARROW + "</button>" +
        '<a href="process.html" class="link-underline text-xs font-semibold uppercase tracking-[0.14em] text-forest sm:ml-4">Understand the Building Process</a></div></div>';
    }

    function summaryDialog() {
      var a = st.answers, c = st.contact;
      var rows = [["Project type", label(P.projectTypes, a.projectType)], ["Land", label(P.landStatuses, a.landStatus)], ["Approximate size", label(P.homeSizes, a.homeSize)], ["Architectural style", label(P.homeStyles, a.style)],
        ["Planning budget (client estimate)", label(P.budgets, a.budget)], ["Timeline", label(P.timelines, a.timeline)], ["Preferred contact", label(P.contactMethods, c.contactMethod)], ["ZIP code", c.zip]];
      var d = document.createElement("dialog");
      d.setAttribute("aria-labelledby", "summary-title");
      d.className = "m-auto max-h-[92svh] w-[min(52rem,calc(100vw-1.5rem))] overflow-y-auto bg-ivory p-0 text-charcoal backdrop:bg-charcoal/70 backdrop:backdrop-blur-sm print:max-h-none print:w-full";
      d.innerHTML = '<div class="p-6 sm:p-12"><div class="flex items-start justify-between gap-6 border-b border-line pb-6"><div class="text-forest"><p class="font-serif text-xl tracking-[0.06em]">AURELIA GROVE</p><p class="text-[0.6rem] font-semibold tracking-[0.3em] text-stone">PROJECT SUMMARY</p></div>' +
        '<button type="button" data-x class="no-print -m-2 p-2 text-2xl leading-none text-stone hover:text-charcoal" aria-label="Close summary">×</button></div>' +
        '<h2 id="summary-title" class="mt-8 text-h3 text-forest">' + esc(c.name) + "'s custom home plan</h2>" +
        '<p class="mt-2 text-sm text-stone">Prepared ' + new Date().toLocaleDateString("en-US", { dateStyle: "long" }) + " · Reference " + submitted.id.slice(-8).toUpperCase() + "</p>" +
        '<dl class="mt-8 grid gap-x-10 sm:grid-cols-2">' + rows.map(function (r) { return '<div class="flex justify-between gap-4 border-b border-line py-3 text-sm"><dt class="text-stone">' + r[0] + '</dt><dd class="text-right font-semibold">' + esc(r[1]) + "</dd></div>"; }).join("") + "</dl>" +
        '<h3 class="mt-10 font-serif text-2xl text-forest">Suggested next steps</h3><ol class="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed">' + nextSteps().map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ol>" +
        '<p class="mt-10 border-l-2 border-terracotta pl-4 text-xs leading-relaxed text-stone">The budget shown is your own planning range, not a quote. Costs, timelines and requirements depend on your lot, design, selections and local approvals. Concept website · Fictional company: this summary was generated in your browser and was not sent to anyone.</p>' +
        '<div class="no-print mt-10 flex flex-col gap-3 sm:flex-row"><button type="button" data-print class="' + BTN_PRIMARY + '"><span>Print or Save as PDF</span></button><button type="button" data-x class="' + BTN_OUTLINE + '"><span>Close</span></button></div></div>';
      document.body.appendChild(d);
      d.addEventListener("click", function (e) {
        if (e.target.closest("[data-x]")) d.close();
        if (e.target.closest("[data-print]")) window.print();
      });
      d.addEventListener("close", function () { d.remove(); });
      d.showModal();
    }

    function render(focus) {
      var body = submitted ? confirmationView() : st.step < TOTAL - 1 ? choiceView(steps[st.step], st.step) : contactView();
      mount.className = "grid min-h-[calc(100svh-7rem)] lg:grid-cols-12";
      mount.innerHTML = sidePanel() + '<div class="flex flex-col bg-ivory lg:col-span-8">' + topBar() + '<div class="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-10 md:py-16">' + body + "</div></div>";
      save();
      if (focus) { var h = $("h1", mount); if (h) h.focus({ preventScroll: true }); window.scrollTo(0, 0); }
      bindContact();
    }

    function goTo(i) { clearTimeout(autoTimer); stepError = ""; st.step = i; render(true); }

    function complete(key, value) {
      var cs = steps[st.step];
      if (!value) { stepError = "Please choose an option to continue."; track("planner_error", { step: st.step + 1, step_name: cs.name, error: "no_selection" }); render(false); return; }
      track("planner_step_complete", { step: st.step + 1, step_name: cs.name, value: value });
      var all = steps.every(function (s) { return s.key === key ? value : st.answers[s.key]; });
      var next = all && returnToContact ? TOTAL - 1 : st.step + 1;
      returnToContact = false;
      goTo(next);
    }

    mount.addEventListener("pointerdown", function (e) { if (e.target.closest("[data-opt]")) pointer = true; });
    mount.addEventListener("change", function (e) {
      var t = e.target;
      if (st.step < TOTAL - 1 && !submitted && t.type === "radio" && t.name === steps[st.step].key) {
        begin();
        st.answers[t.name] = t.value;
        stepError = "";
        var wasPointer = pointer;
        pointer = false;
        render(false);
        var r = $('input[name="' + t.name + '"][value="' + t.value + '"]', mount);
        if (r && !wasPointer) r.focus();
        if (wasPointer) { clearTimeout(autoTimer); autoTimer = setTimeout(function () { complete(t.name, t.value); }, 320); }
      }
    });
    mount.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.target.type === "radio" && st.step < TOTAL - 1) { e.preventDefault(); complete(steps[st.step].key, st.answers[steps[st.step].key]); }
    });
    mount.addEventListener("click", function (e) {
      var t = e.target;
      var jump = t.closest("[data-jump]");
      if (jump && !jump.disabled) { var j = +jump.getAttribute("data-jump"); returnToContact = st.step === TOTAL - 1 && j < st.step; goTo(j); return; }
      if (t.closest("[data-continue]")) { complete(steps[st.step].key, st.answers[steps[st.step].key]); return; }
      if (t.closest("[data-back]")) { goTo(Math.max(0, st.step - 1)); return; }
      var ed = t.closest("[data-edit]");
      if (ed) { returnToContact = true; goTo(+ed.getAttribute("data-edit")); return; }
      if (t.closest("[data-summary]")) summaryDialog();
    });

    function bindContact() {
      var f = $("form", mount);
      if (!f) return;
      var fields = ["name", "email", "phone", "zip"];
      f.addEventListener("input", function (e) {
        if (fields.indexOf(e.target.name) > -1 || e.target.name === "contactMethod") st.contact[e.target.name] = e.target.value;
        if (e.target.name === "zip") {
          var z = e.target.value, hint = $("[data-hint]", e.target.parentElement);
          hint.textContent = /^\d{5}$/.test(z) && !isServiceZip(z) ? "This looks outside our usual service region — send it anyway and we'll let you know if we can help." : "Where you plan to build, or where you live now.";
        }
        save();
      });
      f.addEventListener("change", function (e) { if (e.target.name === "contactMethod") { st.contact.contactMethod = e.target.value; save(); } });
      fields.concat(["consent"]).forEach(function (n) {
        var el = f.elements[n];
        liveValidate(el, n);
      });
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validate(f, ["name", "email", "phone", "zip", "consent"])) { track("planner_error", { step: TOTAL, step_name: "Contact", error: "validation" }); return; }
        var missing = steps.filter(function (s) { return !st.answers[s.key]; })[0];
        if (missing) { stepError = "Please answer this question before sending."; goTo(steps.indexOf(missing)); return; }
        var id = uid();
        saveDemoLead({ id: id, kind: "planner", answers: st.answers, contact: st.contact });
        track("planner_step_complete", { step: TOTAL, step_name: "Contact" });
        track("planner_submit", { project_type: st.answers.projectType, style: st.answers.style, budget: st.answers.budget });
        store.del(KEY);
        submitted = { id: id, first: (st.contact.name || "").trim().split(" ")[0] };
        render(true);
      });
    }

    render(false);
  }
})();
