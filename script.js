(function () {
  "use strict";

  // ---- Carousel ("O que as crianças vão aprender") ----
  var track = document.getElementById("carouselTrack");
  var slideCount = track ? track.children.length : 0;
  var prevBtn = document.getElementById("carouselPrev");
  var nextBtn = document.getElementById("carouselNext");
  var playToggleBtn = document.getElementById("carouselPlayToggle");
  var speedToggleBtn = document.getElementById("carouselSpeedToggle");

  var speeds = [1, 1.5, 0.6];
  var speedLabels = { 1: "1x", 1.5: "1,5x", 0.6: "0,6x" };

  var state = { i: 0, playing: true, speed: 1, timer: null };

  function render() {
    if (track) track.style.transform = "translateX(" + -100 * state.i + "%)";
    if (playToggleBtn) playToggleBtn.textContent = state.playing ? "⏸ Pausar" : "▶ Continuar";
    if (speedToggleBtn) speedToggleBtn.textContent = speedLabels[state.speed];
  }

  function startTimer() {
    clearInterval(state.timer);
    if (!state.playing || slideCount === 0) return;
    state.timer = setInterval(function () {
      state.i = (state.i + 1) % slideCount;
      render();
    }, 2600 / state.speed);
  }

  function goTo(i) {
    state.i = ((i % slideCount) + slideCount) % slideCount;
    state.playing = false;
    render();
    startTimer();
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { goTo(state.i - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { goTo(state.i + 1); });

  if (playToggleBtn) {
    playToggleBtn.addEventListener("click", function () {
      state.playing = !state.playing;
      render();
      startTimer();
    });
  }

  if (speedToggleBtn) {
    speedToggleBtn.addEventListener("click", function () {
      var idx = speeds.indexOf(state.speed);
      state.speed = speeds[(idx + 1) % speeds.length];
      state.playing = true;
      render();
      startTimer();
    });
  }

  render();
  startTimer();

  // ---- Smooth scroll to offers ----
  function goToOffers(e) {
    e.preventDefault();
    var el = document.getElementById("ofertas");
    if (!el) return;
    var doc = document.scrollingElement || document.documentElement;
    var start = doc.scrollTop;
    var target = start + el.getBoundingClientRect().top - 16;
    var t0 = performance.now();
    var dur = 1600;
    function step(now) {
      var p = Math.min(1, (now - t0) / dur);
      var eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      doc.scrollTop = start + (target - start) * eased;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var ctaHero = document.getElementById("ctaHero");
  var ctaFinal = document.getElementById("ctaFinal");
  if (ctaHero) ctaHero.addEventListener("click", goToOffers);
  if (ctaFinal) ctaFinal.addEventListener("click", goToOffers);

  // ---- FAQ accordion ----
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var button = item.querySelector(".faq-question");
    if (!button) return;
    button.addEventListener("click", function () {
      item.classList.toggle("open");
    });
  });
})();
