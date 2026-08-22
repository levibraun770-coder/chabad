(function () {
  "use strict";

  var lastHeight = 0;

  function measure() {
    var page = document.querySelector(".cob-page");
    var height = 0;

    if (page) {
      height = Math.ceil(page.scrollHeight);
    } else if (document.body) {
      height = Math.ceil(document.body.scrollHeight);
    }

    if (height > 0) {
      if (height !== lastHeight) {
        lastHeight = height;
      }

      window.parent.postMessage({
        type: "cob-frame-height",
        height: height
      }, "*");
    }
  }

  window.addEventListener("load", measure);
  window.addEventListener("resize", measure);
  document.addEventListener("DOMContentLoaded", measure);

  window.setTimeout(measure, 100);
  window.setTimeout(measure, 500);
  window.setTimeout(measure, 1500);
  window.setInterval(measure, 1000);

  if (window.ResizeObserver) {
    var page = document.querySelector(".cob-page");
    if (page) {
      new ResizeObserver(measure).observe(page);
    }
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measure);
  }
})();