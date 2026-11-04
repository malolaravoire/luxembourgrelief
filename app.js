(function () {
  document.documentElement.classList.add("js");
  var d = window.LER || {};
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined && text !== null) e.textContent = text;
    return e;
  }
  function safeUrl(u) {
    return typeof u === "string" && /^https:\/\//.test(u) ? u : null;
  }
  function link(url, label, cls) {
    var u = safeUrl(url);
    if (!u) return null;
    var a = el("a", cls, label);
    a.href = u;
    a.rel = "noopener";
    return a;
  }
  function euros(cents) {
    return (cents / 100).toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " €";
  }

  // Numéro RCS
  if (d.rcs) {
    document.querySelectorAll("[data-rcs]").forEach(function (n) {
      n.textContent = "RCS Luxembourg : " + d.rcs;
    });
  }

  // Campagnes
  var c = document.getElementById("campagnes");
  if (c && d.campagnes && d.campagnes.length) {
    c.textContent = "";
    var grid = el("div", "grid");
    var zones = [];
    d.campagnes.forEach(function (k) {
      var card = el("div", "card");
      card.appendChild(el("b", null, k.nom));
      var p = el("p");
      var lines = [];
      lines.push("ONG bénéficiaire : " + (k.ong ? k.ong : "choisie par l'association à la clôture de la campagne"));
      if (k.objectif) lines.push("Objectif : " + k.objectif);
      if (k.periode) lines.push("Période : " + k.periode);
      lines.forEach(function (t, i) {
        if (i) p.appendChild(document.createElement("br"));
        p.appendChild(document.createTextNode(t));
      });
      card.appendChild(p);
      var zone = el("div");
      card.appendChild(zone);
      zones.push(zone);
      var a = link(k.lien, "Faire un don", "btn");
      if (a) { var q = el("p"); q.appendChild(a); card.appendChild(q); }
      grid.appendChild(card);
    });
    c.appendChild(grid);

    // Total reçu, lu automatiquement sur Stripe. En cas de problème, rien n'est affiché.
    var api = safeUrl(d.apiCollecte);
    if (api && window.fetch) {
      fetch(api)
        .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
        .then(function (j) {
          if (!j || !j.totaux) return;
          d.campagnes.forEach(function (k, i) {
            var t = j.totaux[k.lien];
            var cents = t && typeof t.cents === "number" ? t.cents : 0;
            if (!safeUrl(k.lien)) return;
            var box = el("div", "progress");
            var dons = t && t.dons ? t.dons : 0;
            var texte = "Montant reçu : " + euros(cents);
            if (k.objectifEur) texte += " sur " + euros(k.objectifEur * 100);
            texte += " · " + dons + (dons > 1 ? " dons" : " don");
            box.appendChild(el("span", null, texte));
            if (k.objectifEur) {
              var bar = el("div", "bar");
              var fill = el("span");
              fill.style.width = Math.min(100, Math.round((cents / (k.objectifEur * 100)) * 100)) + "%";
              bar.appendChild(fill);
              box.appendChild(bar);
            }
            box.appendChild(el("div", "small", "Montants reçus, avant frais du prestataire de paiement. Mis à jour environ chaque minute."));
            zones[i].appendChild(box);
          });
        })
        .catch(function () {});
    }
  }

  // ONG soutenues
  var o = document.getElementById("ong");
  if (o && d.ong && d.ong.length) {
    o.textContent = "";
    var g2 = el("div", "grid");
    d.ong.forEach(function (n) {
      var card = el("div", "card");
      card.appendChild(el("b", null, n.nom));
      var p = el("p");
      var t = [];
      if (n.campagne) t.push("Campagne : " + n.campagne);
      if (n.zone) t.push("Zone d'intervention : " + n.zone);
      t.forEach(function (x, i) {
        if (i) p.appendChild(document.createElement("br"));
        p.appendChild(document.createTextNode(x));
      });
      var a = link(n.site, "Site de l'ONG");
      if (a) { if (t.length) p.appendChild(document.createElement("br")); p.appendChild(a); }
      card.appendChild(p);
      g2.appendChild(card);
    });
    o.appendChild(g2);
  }

  // Transferts
  var t = document.getElementById("transferts");
  if (t && d.transferts && d.transferts.length) {
    t.textContent = "";
    var table = el("table");
    var head = el("tr");
    ["Date", "Campagne", "ONG bénéficiaire", "Montant", "Justificatifs"].forEach(function (h) {
      head.appendChild(el("th", null, h));
    });
    table.appendChild(head);
    d.transferts.forEach(function (r) {
      var tr = el("tr");
      [r.date, r.campagne, r.ong, r.montant].forEach(function (v) {
        tr.appendChild(el("td", null, v || ""));
      });
      var td = el("td");
      var a1 = link(r.justificatif, "Justificatif bancaire");
      var a2 = link(r.attestation, "Attestation de réception");
      if (a1) td.appendChild(a1);
      if (a1 && a2) td.appendChild(document.createTextNode(" · "));
      if (a2) td.appendChild(a2);
      tr.appendChild(td);
      table.appendChild(tr);
    });
    t.appendChild(table);
  }

  // Rapport annuel
  var r = document.getElementById("rapport");
  if (r && d.rapportAnnuel) {
    var a = link(d.rapportAnnuel, "Télécharger le rapport financier annuel");
    if (a) { r.textContent = ""; r.appendChild(a); }
  }

  // Apparition douce des sections au défilement
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  } else {
    els.forEach(function (e) { e.classList.add("visible"); });
  }
})();
