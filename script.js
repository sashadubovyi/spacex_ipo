/* ============================================================
   SPACEX IPO — script.js
   Mobile-first | GSAP + Lenis | Smooth all animations
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// 1. ОПРЕДЕЛЯЕМ УСТРОЙСТВО
// ============================================================
const isMobile = window.innerWidth <= 920;

// ============================================================
// 2. LENIS — только десктоп
// На мобильных Lenis вызывает прыжки вверх при скролле,
// поэтому на телефонах используем нативный скролл браузера
// ============================================================
let lenis = null;

if (!isMobile) {
    lenis = new Lenis({
        duration: 1.3,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
}

// ============================================================
// 3. MENU OVERLAY
// ============================================================
const menuBtn     = document.getElementById('menuBtn');
const menuOverlay = document.getElementById('menuOverlay');
const navbar      = document.getElementById('navbar');

menuBtn.addEventListener('click', () => {
    const isOpen = menuOverlay.classList.toggle('is-open');
    navbar.classList.toggle('menu-open', isOpen);
    if (isOpen) {
        // Останавливаем скролл под меню
        if (lenis) lenis.stop();
        document.body.style.overflow = 'hidden';
    } else {
        if (lenis) lenis.start();
        document.body.style.overflow = '';
    }
});

// Закрываем меню только по внутренним якорям
document.querySelectorAll('.menu-link:not(.menu-link-external)').forEach(link => {
    link.addEventListener('click', () => {
        menuOverlay.classList.remove('is-open');
        navbar.classList.remove('menu-open');
        if (lenis) lenis.start();
        document.body.style.overflow = '';
    });
});

// ============================================================
// 4. SMOOTH REVEAL (глобальные секции)
// ============================================================
document.querySelectorAll('.smooth-reveal').forEach((el) => {
    gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
            opacity: 1, y: 0,
            ease: "power2.out",
            duration: 0.8,
            scrollTrigger: {
                trigger: el,
                start: "top 88%",
                end: "top 60%",
                scrub: 1.5,
            }
        }
    );
});

// ============================================================
// 5. CHARTS — столбцы выезжают с 0 через GSAP
// ============================================================
const monochromeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        y: {
            grid: { color: 'rgba(255,255,255,0.03)' },
            ticks: { color: '#444', font: { size: 10 } },
            beginAtZero: true,
        },
        x: {
            grid: { display: false },
            ticks: { color: '#888', font: { size: 10 } }
        }
    },
    animation: { duration: 0 }
};

const payloadChart = new Chart(
    document.getElementById('payloadChart').getContext('2d'),
    {
        type: 'bar',
        data: {
            labels: ['FALCON 9', 'STARSHIP'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.85)'],
                borderColor: ['rgba(139,191,255,0.2)', 'rgba(255,255,255,0.3)'],
                borderWidth: 1,
                barThickness: window.innerWidth > 768 ? 50 : 30,
            }]
        },
        options: monochromeOptions
    }
);

const costChart = new Chart(
    document.getElementById('costChart').getContext('2d'),
    {
        type: 'bar',
        data: {
            labels: ['FALCON 9', 'STARSHIP'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['rgba(255,255,255,0.7)', 'rgba(139,191,255,0.3)'],
                borderColor: ['rgba(255,255,255,0.3)', 'rgba(139,191,255,0.4)'],
                borderWidth: 1,
                barThickness: window.innerWidth > 768 ? 50 : 30,
            }]
        },
        options: monochromeOptions
    }
);

ScrollTrigger.create({
    trigger: ".paradigm-charts",
    start: "top 80%",
    once: true,
    onEnter: () => {
        const payloadProxy = { v0: 0, v1: 0 };
        gsap.to(payloadProxy, {
            v0: 22.8, v1: 150,
            duration: 1.6,
            ease: "expo.out",
            onUpdate: () => {
                payloadChart.data.datasets[0].data = [payloadProxy.v0, payloadProxy.v1];
                payloadChart.update('none');
            }
        });

        const costProxy = { v0: 0, v1: 0 };
        gsap.to(costProxy, {
            v0: 67, v1: 10,
            duration: 1.6,
            ease: "expo.out",
            onUpdate: () => {
                costChart.data.datasets[0].data = [costProxy.v0, costProxy.v1];
                costChart.update('none');
            }
        });
    }
});

// ============================================================
// 6. CAPITALIZATION BARS
// ============================================================
gsap.utils.toArray('.metric-bar').forEach((bar) => {
    const tw = bar.getAttribute('data-width');
    gsap.to(bar, {
        width: tw,
        duration: 2,
        ease: "expo.out",
        scrollTrigger: {
            trigger: "#capitalizationSection",
            start: "top 80%",
            once: true,
        }
    });
});

// ============================================================
// 7. REVENUE DONUT
// ============================================================
const fullCircle = 251.2;

const revTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#revenueSection",
        start: "top 72%",
        once: true,
    }
});

revTl
    .to(".starlink-segment", {
        strokeDashoffset: fullCircle * (1 - 0.77),
        duration: 1.4, ease: "power3.out"
    })
    .to("#revStep1", { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }, "-=0.9")
    .to(".launch-segment", {
        strokeDashoffset: fullCircle * (1 - 0.77 - 0.15),
        duration: 0.9, ease: "power2.out"
    }, "-=0.3")
    .to("#revStep2", { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }, "-=0.5")
    .to(".gov-segment", {
        strokeDashoffset: 0,
        duration: 0.7, ease: "power2.out"
    }, "-=0.3")
    .to("#revStep3", { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }, "-=0.5");

// ============================================================
// 8. DESKTOP PIN ANIMATIONS (>920px)
// ============================================================
if (!isMobile) {

    // HERO: SpaceX logo видна сразу, плавно уходит при скролле
    gsap.set("#heroLogoSpaceX", { opacity: 1 });

    const heroTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#heroSection",
            start: "top top",
            end: "+=2200",
            scrub: 1.5,
            pin: true,
            anticipatePin: 1,
        }
    });
    heroTl
        .to("#heroLogoSpaceX", { opacity: 0, y: -50, duration: 0.5, ease: "power2.inOut" })
        .to("#heroLogoBroker", { opacity: 1, y: 0, visibility: "visible", duration: 0.5, ease: "power2.out" })
        .to("#heroLogoBroker", { opacity: 0, y: -50, duration: 0.5, ease: "power2.inOut" }, "+=0.4")
        .to("#heroEventData", { opacity: 1, y: 0, visibility: "visible", duration: 0.5, ease: "power2.out" })
        .to({}, { duration: 0.5 });

    // VALUATION SCRUB
    const valuationTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#valuationScrubSection",
            start: "top top",
            end: "+=5000",
            scrub: 1.5,
            pin: true,
            anticipatePin: 1,
        }
    });
    ['valStep1','valStep2','valStep3','valStep4','valStep5'].forEach((id, i, arr) => {
        valuationTl.to(`#${id}`, { opacity: 1, y: 0, visibility: "visible", duration: 0.4, ease: "power2.out" });
        if (i < arr.length - 1) {
            valuationTl.to(`#${id}`, { opacity: 0, y: -50, visibility: "hidden", duration: 0.4, ease: "power2.inOut" }, "+=0.5");
        }
    });
    valuationTl.to({}, { duration: 0.5 });

    // STARSHIP SCRUB (ракета неподвижна)
    const starshipTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#starshipScrubSection",
            start: "top top",
            end: "+=3000",
            scrub: 1.5,
            pin: true,
            anticipatePin: 1,
        }
    });
    starshipTl
        .to("#step1", { opacity: 1, y: 0, visibility: "visible", duration: 0.4, ease: "power2.out" })
        .to("#step1", { opacity: 0, y: -50, visibility: "hidden", duration: 0.4, ease: "power2.inOut" }, "+=0.5")
        .to("#step2", { opacity: 1, y: 0, visibility: "visible", duration: 0.4, ease: "power2.out" })
        .to("#step2", { opacity: 0, y: -50, visibility: "hidden", duration: 0.4, ease: "power2.inOut" }, "+=0.5")
        .to("#step3", { opacity: 1, y: 0, visibility: "visible", duration: 0.4, ease: "power2.out" })
        .to({}, { duration: 0.5 });

    // TIMELINE SCRUB
    const timelineScrubTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#timelineScrubSection",
            start: "top top",
            end: "+=4500",
            scrub: 1.5,
            pin: true,
            anticipatePin: 1,
        }
    });
    ['2002','2008','2015','2020','2024'].forEach((year, i, arr) => {
        timelineScrubTl.to(`#tlStep${year}`, { opacity: 1, y: 0, visibility: "visible", duration: 0.4, ease: "power2.out" });
        if (i < arr.length - 1) {
            timelineScrubTl.to(`#tlStep${year}`, { opacity: 0, y: -60, visibility: "hidden", duration: 0.4, ease: "power2.inOut" }, "+=0.5");
        }
    });
    timelineScrubTl.to({}, { duration: 0.4 });

} else {
    // ============================================================
    // 9. МОБИЛЬНЫЕ: простые fade-in при скролле
    // ============================================================

    // Hero logo сразу видна, плавно уходит
    gsap.set("#heroLogoSpaceX", { opacity: 1, visibility: "visible" });
    gsap.to("#heroLogoSpaceX", {
        opacity: 0,
        scrollTrigger: {
            trigger: "#heroSection",
            start: "top top",
            end: "bottom 50%",
            scrub: 2,
        }
    });

    // val-step
    document.querySelectorAll('.val-step').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true } }
        );
    });

    // info-step
    document.querySelectorAll('.info-step').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true } }
        );
    });

    // timeline шаги
    document.querySelectorAll('.tl-scrub-step').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true } }
        );
    });
}

// ============================================================
// 10. КАРТОЧКИ — fade-in (все устройства)
// ============================================================
document.querySelectorAll('.partner-card, .ipo-card, .app-card').forEach((el, i) => {
    gsap.fromTo(el,
        { opacity: 0, y: 25 },
        {
            opacity: 1, y: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: (i % 3) * 0.07,
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
                once: true,
            }
        }
    );
});
