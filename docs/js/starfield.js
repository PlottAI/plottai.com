(function () {
    var canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('starfield'));
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var stars = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function initStars() {
        stars = [];
        // Much fewer stars — roughly 1 per 28000px²
        var count = Math.floor((canvas.width * canvas.height) / 28000);
        for (var i = 0; i < count; i++) {
            var t = Math.random();
            // 65% of stars in the top 55% of the screen
            var y = t < 0.65
                ? Math.random() * canvas.height * 0.55
                : Math.random() * canvas.height;
            stars.push({
                x: Math.random() * canvas.width,
                y: y,
                r: Math.random() * 0.9 + 0.5,   // sharp points (0.5–1.4)
                baseAlpha: Math.random() * 0.55 + 0.25,
                phase: Math.random() * Math.PI * 2,
                twinkleSpeed: Math.random() * 0.35 + 0.1,
                drift: (Math.random() - 0.5) * 0.04,
                rise: Math.random() * 0.09 + 0.03
            });
        }
    }

    function draw(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var t = time * 0.001;

        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            var twinkle = Math.sin(t * s.twinkleSpeed + s.phase);
            var alpha = s.baseAlpha * (0.72 + 0.28 * twinkle);

            s.y -= s.rise;
            s.x += s.drift;
            if (s.y < 0) s.y = canvas.height;
            if (s.x < 0) s.x = canvas.width;
            if (s.x > canvas.width) s.x = 0;

            // Sharp crisp dot — no glow, just a clean point
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(225, 232, 255, ' + alpha + ')';
            ctx.fill();
        }

        requestAnimationFrame(draw);
    }

    function isLoading() {
        return document.querySelector('.loading-progress') !== null;
    }

    function isLightMode() {
        return document.querySelector('.light-theme') !== null;
    }

    function applyVisibility() {
        canvas.style.display = (isLightMode() || isLoading()) ? 'none' : 'block';
    }

    // Watch class changes (theme toggle) AND child list changes (loading SVG removed)
    var observer = new MutationObserver(applyVisibility);
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'], childList: true });

    resize();
    initStars();
    applyVisibility();
    requestAnimationFrame(draw);
    window.addEventListener('resize', function () { resize(); initStars(); });
})();
