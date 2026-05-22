// Регистрируем ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 1. Плавный скролл Lenis
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// 2. Глобальный базовый параллакс для элементов с data-speed (только для десктопов)
if (window.innerWidth > 920) {
    document.querySelectorAll('[data-speed]').forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-speed'));
        const yValue = (1 - speed) * 250; 
        gsap.to(el, {
            y: yValue,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
        });
    });
}

// 3. Эффект плавного раскрытия текста по словам
document.querySelectorAll('.reveal-text').forEach((textBlock) => {
    const textContent = textBlock.textContent;
    textBlock.innerHTML = '';
    const words = textContent.trim().split(' ');
    words.forEach(word => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.style.opacity = 0.15; 
        textBlock.appendChild(span);
    });
    const spans = textBlock.querySelectorAll('span');
    gsap.to(spans, {
        opacity: 1,
        stagger: 0.04,
        ease: "none",
        scrollTrigger: { trigger: textBlock, start: "top 85%", end: "bottom 65%", scrub: true }
    });
});

// ==========================================================================
// ДЕСКТОПНЫЕ СЦЕНАРИИ ФИКСАЦИИ (ОТКЛЮЧЕНЫ НА МОБИЛЬНЫХ ДЛЯ СТАБИЛЬНОСТИ)
// ==========================================================================
if (window.innerWidth > 920) {
    
    // Анимация шагов в Hero блоке
    const heroTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#heroSection",
            start: "top top",
            end: "+=2000",
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    });
    heroTl
        .to("#heroLogoSpaceX", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
        .to("#heroLogoSpaceX", { opacity: 0, y: -40, visibility: "hidden", duration: 0.4 }, "+=0.3")
        .to("#heroLogoBroker", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
        .to("#heroLogoBroker", { opacity: 0, y: -40, visibility: "hidden", duration: 0.4 }, "+=0.3")
        .to("#heroEventData", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
        .to({}, { duration: 0.4 });

    // Анимация 5 шагов в блоке Scrub-оценки стоимости
    const valuationTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#valuationScrubSection",
            start: "top top",
            end: "+=4500", // Большая глубина прокрутки для 5 шагов
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    });
    valuationTl
        .to("#valStep1", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
        .to("#valStep1", { opacity: 0, y: -30, visibility: "hidden", duration: 0.4 }, "+=0.4")
        
        .to("#valStep2", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
        .to("#valStep2", { opacity: 0, y: -30, visibility: "hidden", duration: 0.4 }, "+=0.4")
        
        .to("#valStep3", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
        .to("#valStep3", { opacity: 0, y: -30, visibility: "hidden", duration: 0.4 }, "+=0.4")
        
        .to("#valStep4", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
        .to("#valStep4", { opacity: 0, y: -30, visibility: "hidden", duration: 0.4 }, "+=0.4")
        
        .to("#valStep5", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
        .to({}, { duration: 0.4 });

    // Анимация интерактивной ракетной стойки
    const starshipTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#starshipScrubSection",
            start: "top top",
            end: "+=2800",
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    });
    starshipTl
        .to("#step1", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
        .to(".starship-svg-monochrome", { y: "-6%", ease: "none" }, 0)
        .to("#step1", { opacity: 0, y: -40, visibility: "hidden", duration: 0.4 }, "+=0.4")
        .to("#step2", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
        .to("#step2", { opacity: 0, y: -40, visibility: "hidden", duration: 0.4 }, "+=0.4")
        .to("#step3", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
        .to({}, { duration: 0.4 });

} else {
    // Мягкое проявление элементов на мобильных устройствах без фиксации экрана (Pin)
    const mobileSteps = document.querySelectorAll('.hero-step-element, .val-step, .info-step');
    mobileSteps.forEach(step => {
        gsap.fromTo(step, { opacity: 0, y: 30 }, {
            opacity: 1, y: 0, duration: 0.8,
            scrollTrigger: { trigger: step, start: "top 85%", toggleActions: "play none none none" }
        });
    });
}

// ==========================================================================
// СТРОГИЕ ЧБ ДИНАМИЧЕСКИЕ ГРАФИКИ (CHART.JS)
// ==========================================================================
const monochromeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#444', font: { size: 10 } } },
        x: { grid: { display: false }, ticks: { color: '#888', font: { size: 11, weight: 'bold' } } }
    },
    animation: { duration: 0 }
};

const ctxPayload = document.getElementById('payloadChart').getContext('2d');
const payloadChart = new Chart(ctxPayload, {
    type: 'bar',
    data: {
        labels: ['FALCON 9', 'STARSHIP'],
        datasets: [{
            data: [22.8, 150],
            backgroundColor: ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.8)'],
            barThickness: window.innerWidth > 768 ? 45 : 30
        }]
    },
    options: monochromeOptions
});

const ctxCost = document.getElementById('costChart').getContext('2d');
const costChart = new Chart(ctxCost, {
    type: 'bar',
    data: {
        labels: ['FALCON 9', 'STARSHIP (Target)'],
        datasets: [{
            data: [67, 10],
            backgroundColor: ['rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.15)'],
            barThickness: window.innerWidth > 768 ? 45 : 30
        }]
    },
    options: monochromeOptions
});

ScrollTrigger.create({
    trigger: ".paradigm-charts",
    start: "top 80%",
    onEnter: () => {
        payloadChart.options.animation.duration = 1200;
        costChart.options.animation.duration = 1200;
        payloadChart.update();
        costChart.update();
    }
});
