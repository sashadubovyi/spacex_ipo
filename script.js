/* ============================================================
   SPACEX IPO — script.js
   Mobile-first | GSAP + Lenis | Smooth all animations
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// 1. LENIS SMOOTH SCROLL
// ============================================================
const lenis = new Lenis({
    duration: 1.3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// ============================================================
// 2. MENU OVERLAY
// ============================================================
const menuBtn = document.getElementById('menuBtn');
const menuOverlay = document.getElementById('menuOverlay');
const navbar = document.getElementById('navbar');

menuBtn.addEventListener('click', () => {
    const isOpen = menuOverlay.classList.toggle('is-open');
    navbar.classList.toggle('menu-open', isOpen);
    if (isOpen) {
        lenis.stop();
    } else {
        lenis.start();
    }
});

// Close on link click (only internal anchors)
document.querySelectorAll('.menu-link:not(.menu-link-external)').forEach(link => {
    link.addEventListener('click', () => {
        menuOverlay.classList.remove('is-open');
        navbar.classList.remove('menu-open');
        lenis.start();
    });
});

// ============================================================
// 3. SMOOTH REVEAL (global sections)
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
// 4. CHARTS (работают на всех устройствах)
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
    animation: {
        duration: 0  // отключено по умолчанию, запустим вручную
    }
};

const payloadChart = new Chart(
    document.getElementById('payloadChart').getContext('2d'),
    {
        type: 'bar',
        data: {
            labels: ['FALCON 9', 'STARSHIP'],
            datasets: [{
                data: [0, 0],  // старт с нуля
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
                data: [0, 0],  // старт с нуля
                backgroundColor: ['rgba(255,255,255,0.7)', 'rgba(139,191,255,0.3)'],
                borderColor: ['rgba(255,255,255,0.3)', 'rgba(139,191,255,0.4)'],
                borderWidth: 1,
                barThickness: window.innerWidth > 768 ? 50 : 30,
            }]
        },
        options: monochromeOptions
    }
);

// Запускаем анимацию при скролле: GSAP меняет данные от 0 до целевых значений
const payloadTarget = [22.8, 150];
const costTarget    = [67, 10];

ScrollTrigger.create({
    trigger: ".paradigm-charts",
    start: "top 80%",
    once: true,
    onEnter: () => {
        // Анимируем через GSAP proxy-объект
        const payloadProxy = { v0: 0, v1: 0 };
        gsap.to(payloadProxy, {
            v0: payloadTarget[0],
            v1: payloadTarget[1],
            duration: 1.6,
            ease: "expo.out",
            onUpdate: () => {
                payloadChart.data.datasets[0].data = [payloadProxy.v0, payloadProxy.v1];
                payloadChart.update('none');
            }
        });

        const costProxy = { v0: 0, v1: 0 };
        gsap.to(costProxy, {
            v0: costTarget[0],
            v1: costTarget[1],
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
// 5. CAPITALIZATION BARS
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
// 6. REVENUE DONUT
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
        duration: 1.4,
        ease: "power3.out"
    })
    .to("#revStep1", { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }, "-=0.9")
    .to(".launch-segment", {
        strokeDashoffset: fullCircle * (1 - 0.77 - 0.15),
        duration: 0.9,
        ease: "power2.out"
    }, "-=0.3")
    .to("#revStep2", { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }, "-=0.5")
    .to(".gov-segment", {
        strokeDashoffset: 0,
        duration: 0.7,
        ease: "power2.out"
    }, "-=0.3")
    .to("#revStep3", { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }, "-=0.5");

// ============================================================
// 7. DESKTOP PIN ANIMATIONS (>920px)
// ============================================================
if (window.innerWidth > 920) {

    // --- HERO: SpaceX logo visible on load, fades on scroll ---
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
        // SpaceX logo — уже видна, плавно исчезает
        .to("#heroLogoSpaceX", {
            opacity: 0,
            y: -50,
            duration: 0.5,
            ease: "power2.inOut"
        })
        // Broker logo — появляется
        .to("#heroLogoBroker", {
            opacity: 1,
            y: 0,
            visibility: "visible",
            duration: 0.5,
            ease: "power2.out"
        })
        // Broker logo — исчезает
        .to("#heroLogoBroker", {
            opacity: 0,
            y: -50,
            duration: 0.5,
            ease: "power2.inOut"
        }, "+=0.4")
        // Event data — появляется
        .to("#heroEventData", {
            opacity: 1,
            y: 0,
            visibility: "visible",
            duration: 0.5,
            ease: "power2.out"
        })
        .to({}, { duration: 0.5 });

    // --- VALUATION SCRUB ---
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
        valuationTl.to(`#${id}`, {
            opacity: 1, y: 0, visibility: "visible",
            duration: 0.4, ease: "power2.out"
        });
        if (i < arr.length - 1) {
            valuationTl.to(`#${id}`, {
                opacity: 0, y: -50, visibility: "hidden",
                duration: 0.4, ease: "power2.inOut"
            }, "+=0.5");
        }
    });
    valuationTl.to({}, { duration: 0.5 });

    // --- STARSHIP SCRUB (ракета неподвижна) ---
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
        .to("#step1", {
            opacity: 1, y: 0, visibility: "visible",
            duration: 0.4, ease: "power2.out"
        })
        // Ракета СТОИТ — никуда не едет
        .to("#step1", {
            opacity: 0, y: -50, visibility: "hidden",
            duration: 0.4, ease: "power2.inOut"
        }, "+=0.5")
        .to("#step2", {
            opacity: 1, y: 0, visibility: "visible",
            duration: 0.4, ease: "power2.out"
        })
        .to("#step2", {
            opacity: 0, y: -50, visibility: "hidden",
            duration: 0.4, ease: "power2.inOut"
        }, "+=0.5")
        .to("#step3", {
            opacity: 1, y: 0, visibility: "visible",
            duration: 0.4, ease: "power2.out"
        })
        .to({}, { duration: 0.5 });

    // --- TIMELINE SCRUB ---
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
        timelineScrubTl.to(`#tlStep${year}`, {
            opacity: 1, y: 0, visibility: "visible",
            duration: 0.4, ease: "power2.out"
        });
        if (i < arr.length - 1) {
            timelineScrubTl.to(`#tlStep${year}`, {
                opacity: 0, y: -60, visibility: "hidden",
                duration: 0.4, ease: "power2.inOut"
            }, "+=0.5");
        }
    });
    timelineScrubTl.to({}, { duration: 0.4 });

} else {
    // ============================================================
    // 8. MOBILE: Fade-in при скролле (все элементы изначально видны)
    // ============================================================

    // На мобильных Hero: SpaceX logo сразу видна
    gsap.set("#heroLogoSpaceX", { opacity: 1, visibility: "visible" });

    // Мобильные fade-in для val-step
    document.querySelectorAll('.val-step').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 88%",
                    once: true,
                }
            }
        );
    });

    // Мобильные fade-in для info-step (starship)
    document.querySelectorAll('.info-step').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 88%",
                    once: true,
                }
            }
        );
    });

    // Мобильные fade-in для timeline шагов
    document.querySelectorAll('.tl-scrub-step').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 88%",
                    once: true,
                }
            }
        );
    });

    // Hero logo fade-out при скролле на мобильных
    gsap.to("#heroLogoSpaceX", {
        opacity: 0,
        y: -40,
        scrollTrigger: {
            trigger: "#heroSection",
            start: "top top",
            end: "bottom 60%",
            scrub: 1.5,
        }
    });
}

// ============================================================
// 9. PARTNER CARDS — fade in (все устройства)
// ============================================================
document.querySelectorAll('.partner-card, .ipo-card, .app-card').forEach((el, i) => {
    gsap.fromTo(el,
        { opacity: 0, y: 25 },
        {
            opacity: 1, y: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: (i % 3) * 0.08,
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
                once: true,
            }
        }
    );
});
