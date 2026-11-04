// ---- SETTINGS ----
// Easiest: make a free form at formspree.io and paste its URL here (e.g. "https://formspree.io/f/xxxxxxx").
// Leave it empty and the form will open an email to CONTACT_EMAIL instead.
var FORM_ENDPOINT = "";
var CONTACT_EMAIL = ""; // e.g. "you@mymail.pomona.edu"

// ---- PAYMENT SETTINGS (fill these in) ----
var VENMO_USER = "goodnghbr";      // Venmo username, no @
var PAYPAL_USER = "";              // PayPal.me name, e.g. "janedoe"
var ZELLE_ID = "";                 // email or phone number registered with Zelle
var PRICE = 2;

(function () {
  var v = document.getElementById("pay-venmo");
  if (!v) return;
  var p = document.getElementById("pay-paypal");
  var z = document.getElementById("pay-zelle");
  var zn = document.getElementById("zelle-note");

  v.href = VENMO_USER
    ? "https://venmo.com/" + encodeURIComponent(VENMO_USER) + "?txn=pay&amount=" + PRICE + "&note=" + encodeURIComponent("GoodNeighbor")
    : "#";
  p.href = PAYPAL_USER
    ? "https://paypal.me/" + encodeURIComponent(PAYPAL_USER) + "/" + PRICE
    : "#";

  [[v, VENMO_USER], [p, PAYPAL_USER]].forEach(function (x) {
    x[0].addEventListener("click", function (e) {
      if (!x[1]) { e.preventDefault(); zn.textContent = "That payment option isn't set up yet."; }
    });
  });

  z.addEventListener("click", function () {
    if (!ZELLE_ID) { zn.textContent = "Zelle isn't set up yet."; return; }
    zn.textContent = "Send $" + PRICE + " in your bank app via Zelle to: " + ZELLE_ID + " (copied)";
    try { navigator.clipboard.writeText(ZELLE_ID); } catch (e) {}
  });
})();

// ---- twinkling stars + background plate ----
(function () {
  var svg = '<svg class="plate" viewBox="0 0 400 400" fill="none" stroke="#fff" stroke-linecap="round" aria-hidden="true">' +
    '<circle cx="200" cy="200" r="150" stroke-opacity=".16" stroke-width=".8"/>' +
    '<circle cx="200" cy="200" r="112" stroke-opacity=".09" stroke-width=".6"/>' +
    '<g stroke-opacity=".28" stroke-width=".8">' +
    '<path d="M20 110V150M28 110V150M36 110V150M20 150Q28 168 36 150M28 162V290"/>' +
    '<ellipse cx="372" cy="130" rx="11" ry="18"/><path d="M372 148V290"/></g></svg>';
  document.body.insertAdjacentHTML("afterbegin", svg);
  var n = Math.max(30, Math.min(Math.round(innerWidth * innerHeight / 9000), 120));
  for (var i = 0; i < n; i++) {
    var s = document.createElement("div"), z = Math.random() < .8 ? 1 : 2;
    s.className = "star";
    s.style.left = Math.random() * 100 + "vw";
    s.style.top = Math.random() * 100 + "vh";
    s.style.width = s.style.height = z + "px";
    s.style.animationDuration = (2.5 + Math.random() * 4) + "s";
    s.style.animationDelay = (-Math.random() * 6) + "s";
    document.body.appendChild(s);
  }
})();

// ---- interest form ----
var form = document.getElementById("interest");
if (form) {
  var msg = document.getElementById("msg");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var role = form.getAttribute("data-role");
    var lines = [];
    data.forEach(function (v, k) { lines.push(k + ": " + v); });
    var body = lines.join("\n");

    if (FORM_ENDPOINT) {
      data.append("role", role);
      fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (r) {
          if (!r.ok) throw new Error();
          form.reset();
          msg.textContent = "Thanks! You're on the list. We'll reach out when GoodNeighbor launches.";
        })
        .catch(function () { msg.textContent = "Something went wrong. Please try again."; });
    } else if (CONTACT_EMAIL) {
      window.location.href = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent("GoodNeighbor interest: " + role) +
        "&body=" + encodeURIComponent(body);
      msg.textContent = "Opening your email app to send it...";
    } else {
      msg.textContent = "Form isn't connected yet. Add FORM_ENDPOINT or CONTACT_EMAIL in app.js.";
    }
  });
}
