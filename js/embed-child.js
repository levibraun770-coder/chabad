(function () {
  "use strict";
  function measure() {
    var body = document.body;
    var root = document.documentElement;
    var height = Math.max(
      body ? body.scrollHeight : 0,
      body ? body.offsetHeight : 0,
      root ? root.scrollHeight : 0,
      root ? root.offsetHeight : 0
    );
    window.parent.postMessage({ type: "cob-frame-height", height: Math.ceil(height) }, "*");
  }
  function queueMeasures() {
    measure();
    window.setTimeout(measure, 100);
    window.setTimeout(measure, 400);
    window.setTimeout(measure, 1200);
  }
  window.addEventListener("load", queueMeasures);
  window.addEventListener("resize", queueMeasures);
  document.addEventListener("DOMContentLoaded", queueMeasures);
  if (window.ResizeObserver) {
    new ResizeObserver(measure).observe(document.documentElement);
  }
  if (window.MutationObserver) {
    new MutationObserver(measure).observe(document.documentElement, { childList: true, subtree: true, attributes: true });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueMeasures);
})();