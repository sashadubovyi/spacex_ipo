// Активируем необходимые плагины GSAP
gsap.registerPlugin(ScrollTrigger);

// 1. Плавный кинематографичный скролл Lenis
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// 2. Глобальный базовый параллакс для элементов с data-speed
document.querySelectorAll('[data-speed]').forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-speed'));
    const yValue = (1 - speed) * 250; 
    gsap.to(el, {
        y: yValue,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
    });
});

// 3. Интеллектуальное пословесное проявление типографики (Reveal Text)
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

// 4. Реализация Scrub-анимации фиксированного блока со Starship ракетной стойкой
// Работает только на экранах шире 920px, на мобилках перестраивается в нативный поток
if (window.innerWidth > 920) {
    const starshipTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#starshipScrubSection",
            start: "top top",
            end: "+=2800", // Дистанция фиксации экрана
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    });

    starshipTl
        // Первый шаг проявляется сразу
        .to("#step1", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
        // Ракета медленно смещается по вертикали (микропараллакс) на фоне прокрутки текста
        .to(".starship-svg-monochrome", { y: "-6%", ease: "none" }, 0)
        
        // Шаг 1 затухает -> Шаг 2 вылетает
        .to("#step1", { opacity: 0, y: -40, visibility: "hidden", duration: 0.4 }, "+=0.4")
        .to("#step2", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
        
        // Шаг 2 затухает -> Шаг 3 вылетает
        .to("#step2", { opacity: 0, y: -40, visibility: "hidden", duration: 0.4 }, "+=0.4")
        .to("#step3", { opacity: 1, y: 0, visibility: "visible", duration: 0.4 })
        
        // Финальная микропауза для фиксации внимания перед выходом из блока
        .to({}, { duration: 0.4 });
}

// 5. Инициализация ЧБ Динамических графиков через Chart.js
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#444', font: { size: 10 } } },
        x: { grid: { display: false }, ticks: { color: '#999', font: { size: 12, weight: 'bold' } } }
    },
    animation: { duration: 0 } // Отключаем автостарт, запуск контролирует ScrollTrigger
};

// График нагрузки (ЧБ палитра)
const ctxPayload = document.getElementById('payloadChart').getContext('2d');
const payloadChart = new Chart(ctxPayload, {
    type: 'bar',
    data: {
        labels: ['FALCON 9', 'STARSHIP'],
        datasets: [{
            data: [22.8, 150],
            backgroundColor: ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.85)'],
            barThickness: 45
        }]
    },
    options: chartOptions
});

// График стоимости полета (ЧБ палитра)
const ctxCost = document.getElementById('costChart').getContext('2d');
const costChart = new Chart(ctxCost, {
    type: 'bar',
    data: {
        labels: ['FALCON 9', 'STARSHIP (Target)'],
        datasets: [{
            data: [67, 10],
            backgroundColor: ['rgba(255, 255, 255, 0.75)', 'rgba(255, 255, 255, 0.2)'],
            barThickness: 45
        }]
    },
    options: chartOptions
});

// Триггер запуска анимации графиков при попадании в зону видимости
ScrollTrigger.create({
    trigger: ".paradigm-charts",
    start: "top 75%",
    onEnter: () => {
        payloadChart.options.animation.duration = 1400;
        costChart.options.animation.duration = 1400;
        payloadChart.update();
        costChart.update();
    }
});
