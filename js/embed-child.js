(function () {
  "use strict";

  function measure() {
    var page = document.querySelector(".cob-page");
    var height = 0;

    if (page) {
      height = Math.ceil(page.getBoundingClientRect().height);
    } else if (document.body) {
      height = Math.ceil(document.body.getBoundingClientRect().height);
    }

    if (height > 0) {
      window.parent.postMessage({
        type: "cob-frame-height",
        height: height
      }, "*");
    }
  }

  function queueMeasures() {
    measure();
    window.setTimeout(measure, 100);
    window.setTimeout(measure, 400);
    window.setTimeout(measure, 1200);
    window.setTimeout(measure, 2500);
  }

  window.addEventListener("load", queueMeasures);
  window.addEventListener("resize", queueMeasures);
  document.addEventListener("DOMContentLoaded", queueMeasures);

  if (window.ResizeObserver) {
    var page = document.querySelector(".cob-page");
    if (page) {
      new ResizeObserver(measure).observe(page);
    }
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(queueMeasures);
  }
})();