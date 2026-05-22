// Регистрация ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 1. Инициализация плавного скролла Lenis
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// 2. Глобальное интерактивное проявление контента на страницах
document.querySelectorAll('.smooth-reveal').forEach((block) => {
    gsap.fromTo(block, 
        { opacity: 0, y: 50 },
        {
            opacity: 1, 
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
                trigger: block,
                start: "top 88%",
                end: "top 65%",
                scrub: 1
            }
        }
    );
});

// ==========================================================================
// РАЗДЕЛЕНИЕ ЛОГИКИ: ДЕСКТОП (PIN-АНИМАЦИИ) ПРОТИВ МОБИЛЬНЫХ
// ==========================================================================
if (window.innerWidth > 920) {
    
    // Анимация в Hero блоке (Десктоп)
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

    // Анимация 5 шагов в блоке Оценки стоимости (Десктоп)
    const valuationTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#valuationScrubSection",
            start: "top top",
            end: "+=4500",
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    });
    valuationTl
        .to("#valStep1", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
        .to("#valStep1", { opacity: 0, y: -40, visibility: "hidden", duration: 0.4 }, "+=0.4")
        .to("#valStep2", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
        .to("#valStep2", { opacity: 0, y: -40, visibility: "hidden", duration: 0.4 }, "+=0.4")
        .to("#valStep3", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
        .to("#valStep3", { opacity: 0, y: -40, visibility: "hidden", duration: 0.4 }, "+=0.4")
        .to("#valStep4", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
        .to("#valStep4", { opacity: 0, y: -40, visibility: "hidden", duration: 0.4 }, "+=0.4")
        .to("#valStep5", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
        .to({}, { duration: 0.4 });

    // Анимация интерактивной стойки ракеты Starship (Десктоп)
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

    // Анимация таймлайна (Десктоп)
    const timelineScrubTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#timelineScrubSection",
            start: "top top",
            end: "+=4000",
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    });
    const steps = ["2002", "2008", "2015", "2020", "2024"];
    steps.forEach((year, index) => {
        timelineScrubTl.to(`#tlStep${year}`, { opacity: 1, y: 0, visibility: "visible", duration: 0.4 });
        if (index < steps.length - 1) {
            timelineScrubTl.to(`#tlStep${year}`, { opacity: 0, y: -60, visibility: "hidden", duration: 0.4 }, "+=0.5");
        }
    });
    timelineScrubTl.to({}, { duration: 0.4 });

} else {
    // ЛОГИКА ДЛЯ МОБИЛЬНЫХ ТЕЛЕФОНОВ (Простое красивое появление при скролле сверху вниз)
    const mobileElements = document.querySelectorAll('.hero-step-element, .val-step, .info-step, .tl-scrub-step');
    mobileElements.forEach(el => {
        gsap.fromTo(el, 
            { opacity: 0, y: 30 }, 
            {
                opacity: 1, 
                y: 0, 
                duration: 0.6,
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });
}

// ==========================================================================
// ЧБ ГРАФИКИ CHART.JS (РАБОТАЮТ НА ВСЕХ УСТРОЙСТВАХ)
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
            barThickness: window.innerWidth > 768 ? 45 : 25
        }]
    },
    options: monochromeOptions
});

const ctxCost = document.getElementById('costChart').getContext('2d');
const costChart = new Chart(ctxCost, {
    type: 'bar',
    data: {
        labels: ['FALCON 9', 'STARSHIP'],
        datasets: [{
            data: [67, 10],
            backgroundColor: ['rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.15)'],
            barThickness: window.innerWidth > 768 ? 45 : 25
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

// ==========================================================================
// АНИМАЦИЯ ВЫЕЗДА БЛОКОВ КАПИТАЛИЗАЦИИ С 0 (ДИНАМИЧНО И ДЛЯ МОБИЛЬНЫХ, И ДЛЯ ПК)
// ==========================================================================
gsap.utils.toArray('.metric-bar').forEach((bar) => {
    const targetWidth = bar.getAttribute('data-width');
    
    gsap.to(bar, {
        width: targetWidth,
        duration: 1.8,
        ease: "back.out(1.2)", 
        scrollTrigger: {
            trigger: "#capitalizationSection",
            start: "top 80%", 
            toggleActions: "play none none none" 
        }
    });
});

// ==========================================================================
// АНИМАЦИЯ СЕКЦИИ ВЫРУЧКИ (КРУГ + ТЕКСТ)
// ==========================================================================
const revTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#revenueSection",
        start: "top 70%",
        toggleActions: "play none none none"
    }
});

// Длина окружности для r=40 составляет ~251.2
const fullCircle = 251.2;

// Анимация Starlink (77%)
revTl.to(".starlink-segment", {
    strokeDashoffset: fullCircle * (1 - 0.77),
    duration: 1.2,
    ease: "power2.out"
})
.to("#revStep1", { opacity: 1, x: 0, duration: 0.6 }, "-=0.8")

// Анимация Launch (15%)
.to(".launch-segment", {
    strokeDashoffset: fullCircle * (1 - (0.77 + 0.15)),
    duration: 0.8,
    ease: "power2.out"
}, "-=0.2")
.to("#revStep2", { opacity: 1, x: 0, duration: 0.6 }, "-=0.4")

// Анимация Gov (8%)
.to(".gov-segment", {
    strokeDashoffset: 0, // 100% окружности
    duration: 0.6,
    ease: "power2.out"
}, "-=0.2")
.to("#revStep3", { opacity: 1, x: 0, duration: 0.6 }, "-=0.4");

// ==========================================================================
// АНИМАЦИЯ IPO ТРАНСФОРМАЦИИ (GSAP FLIP + SCROLLTRIGGER)
// ==========================================================================
const gridContainer = document.getElementById("flipCardsGrid");
const cards = gsap.utils.toArray(".flip-card");

// Инициализируем ScrollTrigger таймлайн для фиксации экрана
const flipTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "#ipoFlipSection",
        start: "top top",
        end: "+=2500", // Длина скролла фиксации
        scrub: true,
        pin: true,
        anticipatePin: 1
    }
});

// Шаг 1: Появление карточек по очереди (stagger) из прозрачности в центр
flipTimeline.fromTo(cards, 
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 }
);

// Шаг 2: Исчезновение подробного текста (.full-content)
flipTimeline.to(".full-content", {
    opacity: 0,
    duration: 0.6,
    stagger: 0.1
}, "+=0.2");

// Функция-прослойка для фиксации состояния макета через GSAP Flip
flipTimeline.add(() => {
    // Берём слепок текущих позиций элементов
    const state = Flip.getState(cards);
    
    // Переключаем класс CSS (макет мгновенно перестраивается в памяти)
    gridContainer.classList.toggle("state-grid");
    gridContainer.classList.toggle("state-stack");
    
    // Заставляем Flip плавно анимировать разлет элементов из старой позиции в новую
    Flip.from(state, {
        duration: 1,
        ease: "power2.inOut",
        absolute: true, // Предотвращает дергание Grid во время анимации
    });
}, "+=0.1");

// Шаг 3: Плавное проявление короткого текста (.short-content) внутри новых квадратов
flipTimeline.to(".short-content", {
    opacity: 1,
    duration: 0.6,
    stagger: 0.1
}, "-=0.3");

// Дополнительная задержка в конце фиксации, чтобы пользователь успел рассмотреть готовую сетку
flipTimeline.to({}, { duration: 0.5 });
