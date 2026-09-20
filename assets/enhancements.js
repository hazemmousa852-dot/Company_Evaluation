(function () {
  "use strict";

  var root = document.getElementById("root");
  if (!root) return;

  var scheduled = false;

  function findHeading(text) {
    return Array.from(root.querySelectorAll("h1, h2, h3")).find(function (node) {
      return node.textContent.trim().includes(text);
    });
  }

  function addTrustStrip() {
    if (document.getElementById("audit-trust-strip")) return;
    var heading = findHeading("بيانات المنشأة وورقة التقييم");
    if (!heading) return;

    var strip = document.createElement("div");
    strip.id = "audit-trust-strip";
    strip.className = "audit-trust-strip";
    strip.setAttribute("aria-label", "معلومات مهمة عن الأداة");
    strip.innerHTML =
      '<div class="audit-trust-item"><span class="audit-trust-icon">🔒</span><span><b>خصوصية البيانات</b><br>تظل إجاباتك على جهازك ولا تُرسل إلى خادم خارجي.</span></div>' +
      '<div class="audit-trust-item"><span class="audit-trust-icon">📅</span><span><b>آخر مراجعة للمحتوى</b><br>سبتمبر 2026</span></div>' +
      '<div class="audit-trust-item"><span class="audit-trust-icon">⚖️</span><span><b>نتيجة استرشادية</b><br>التقديرات لا تُعد فتوى أو قراراً قانونياً نهائياً.</span></div>';

    var intro = heading.parentElement;
    if (intro && intro.parentElement) intro.insertAdjacentElement("afterend", strip);
  }

  function addStatusGuide() {
    if (document.getElementById("audit-status-guide")) return;
    var strip = document.getElementById("audit-trust-strip");
    if (!strip) return;

    var guide = document.createElement("aside");
    guide.id = "audit-status-guide";
    guide.className = "audit-status-guide";
    guide.innerHTML =
      '<h3>كيف تختار حالة كل بند؟</h3>' +
      '<div class="audit-status-options">' +
      '<div class="audit-status-option is-complete"><b>كامل وموثّق</b>مطبق فعلياً ويوجد مستند أو سجل يثبت التنفيذ.</div>' +
      '<div class="audit-status-option is-partial"><b>مطبق جزئيًا / غير موثّق</b>يوجد تطبيق ناقص، أو التنفيذ قائم لكن الدليل غير مكتمل.</div>' +
      '<div class="audit-status-option is-missing"><b>غير متوفر</b>البند غير مطبق حالياً أو لا يوجد ما يثبت تنفيذه.</div>' +
      "</div>";
    strip.insertAdjacentElement("afterend", guide);
  }

  function clarifyPartialLabels() {
    root.querySelectorAll("button").forEach(function (button) {
      if (button.textContent.trim() === "جزئي / غير موثّق") {
        button.textContent = "مطبق جزئيًا / غير موثّق";
      }
      if (button.textContent.trim() === "مطبق جزئيًا / غير موثّق") {
        button.title = "اخترها عند وجود تطبيق ناقص أو عدم اكتمال المستندات المؤيدة";
      }
    });
  }

  function updateProgressChip() {
    var chip = document.getElementById("audit-progress-chip");
    if (!chip) {
      chip = document.createElement("div");
      chip.id = "audit-progress-chip";
      chip.className = "audit-progress-chip";
      chip.setAttribute("role", "status");
      chip.innerHTML = '<span class="audit-progress-dot"></span><span class="audit-progress-text"></span>';
      document.body.appendChild(chip);
    }

    var progress = Array.from(root.querySelectorAll("p")).find(function (node) {
      return node.textContent.includes("أُجيب عن") && node.textContent.includes("بند");
    });
    var text = progress ? progress.textContent.replace(/\s+/g, " ").trim() : "";
    chip.querySelector(".audit-progress-text").textContent = text;
    chip.classList.toggle("is-visible", Boolean(text));
  }

  function applyEnhancements() {
    addTrustStrip();
    addStatusGuide();
    clarifyPartialLabels();
    updateProgressChip();
  }

  function scheduleEnhancements() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(function () {
      scheduled = false;
      applyEnhancements();
    });
  }

  applyEnhancements();
  new MutationObserver(scheduleEnhancements).observe(root, {
    childList: true,
    subtree: true,
    characterData: true
  });
})();
