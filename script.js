// Регистрация GSAP плагина
gsap.registerPlugin(ScrollTrigger);

// 1. Инициализация плавного скролла Lenis (активен на всех устройствах)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// 2. Глобальное интерактивное появление контента на страницах (Fade-In-Up со скролл-зависимостью)
document.querySelectorAll('.smooth-reveal').forEach((block) => {
    gsap.fromTo(block, 
        { opacity: 0, y: 50 },
        {
            opacity: 1, 
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
                trigger: block,
                start: "top 90%",   // Начинает проявляться при пересечении 90% высоты экрана
                end: "top 65%",     // Полностью проявляется к 65% высоты экрана
                scrub: 1            // Эффект затухания и появления жестко привязан к колесу скролла
            }
        }
    );
});

// ==========================================================================
// ИНТЕРАКТИВНЫЕ SCRUB-БЛОКИ С ФИКСАЦИЕЙ (РАБОТАЮТ И НА ПК, И НА МОБИЛЬНЫХ)
// ==========================================================================

// Анимация в Hero блоке
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

// Анимация шагов в блоке "Беспрецедентная оценка"
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

// Анимация интерактивной сборки/смещения ракеты Starship
const starshipTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#starshipScrubSection",
        start: "top top",
        end: "+=3000",
        scrub: 1,
        pin: true,
        anticipatePin: 1
    }
});
starshipTl
    .to("#step1", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
    .to(".starship-svg-monochrome", { y: window.innerWidth > 920 ? "-6%" : "-3%", ease: "none" }, 0)
    .to("#step1", { opacity: 0, y: -40, visibility: "hidden", duration: 0.4 }, "+=0.4")
    .to("#step2", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
    .to("#step2", { opacity: 0, y: -40, visibility: "hidden", duration: 0.4 }, "+=0.4")
    .to("#step3", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
    .to({}, { duration: 0.4 });

// ==========================================================================
// ПОЭТАПНЫЙ НАПЛЫВ КАРТОЧЕК В ТАЙМЛАЙНЕ С УХОДОМ ВВЕРХ (ПК + МОБИЛЬНЫЕ)
// ==========================================================================
const timelineScrubTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#timelineScrubSection",
        start: "top top",
        end: "+=9500", // Глубокий таймлайн для равномерного распределения 14 шагов
        scrub: 1,
        pin: true,
        anticipatePin: 1
    }
});

const steps = ["2002", "2006", "2007", "2008", "2010", "2012", "2014", "2015", "2018", "2019", "2020", "2021", "2023", "2024"];

steps.forEach((year, index) => {
    // 1. Текущая карточка выплывает снизу вверх и становится полностью непрозрачной
    timelineScrubTl.to(`#tlStep${year}`, { opacity: 1, y: 0, visibility: "visible", duration: 0.4 });
    
    // 2. Если это не последний год, при дальнейшем скролле уводим карточку еще выше и растворяем
    if (index < steps.length - 1) {
        timelineScrubTl.to(`#tlStep${year}`, { opacity: 0, y: -70, visibility: "hidden", duration: 0.4 }, "+=0.5");
    }
});
// Пауза в конце скролла для фиксации финального года (2024) перед расфиксацией экрана
timelineScrubTl.to({}, { duration: 0.4 });


// ==========================================================================
// ЧБ ГРАФИКИ CHART.JS
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
        labels: ['FALCON 9', 'STARSHIP (Target)'],
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
