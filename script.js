gsap.registerPlugin(ScrollTrigger);

// Инициализация плавного скролла Lenis
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// Глобальный параллакс для data-speed элементов
document.querySelectorAll('[data-speed]').forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-speed'));
    const yValue = (1 - speed) * 250; 
    gsap.to(el, {
        y: yValue,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
    });
});

// Анимация раскрытия текста по словам
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

/* НАСТРОЙКА ДИНАМИЧЕСКИХ ГРАФИКОВ (CHART.JS) */

// График 1: Полезная нагрузка
const ctxPayload = document.getElementById('payloadChart').getContext('2d');
const payloadChart = new Chart(ctxPayload, {
    type: 'bar',
    data: {
        labels: ['FALCON 9', 'STARSHIP'],
        datasets: [{
            data: [22.8, 150],
            backgroundColor: ['rgba(255, 255, 255, 0.2)', '#00aeef'],
            borderWidth: 0,
            barThickness: 40
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#666' } },
            x: { grid: { display: false }, ticks: { color: '#fff', font: { weight: 'bold' } } }
        },
        // Отключаем начальную встроенную анимацию, чтобы запустить ее через GSAP
        animation: { duration: 0 } 
    }
});

// График 2: Стоимость запуска
const ctxCost = document.getElementById('costChart').getContext('2d');
const costChart = new Chart(ctxCost, {
    type: 'bar',
    data: {
        labels: ['FALCON 9', 'STARSHIP (Target)'],
        datasets: [{
            data: [67, 10], // Берем верхнюю границу таргета $10M для наглядности
            backgroundColor: ['#00aeef', 'rgba(235, 94, 40, 0.8)'],
            borderWidth: 0,
            barThickness: 40
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#666' } },
            x: { grid: { display: false }, ticks: { color: '#fff', font: { weight: 'bold' } } }
        },
        animation: { duration: 0 }
    }
});

// Анимация триггера графиков при скролле с помощью GSAP ScrollTrigger
ScrollTrigger.create({
    trigger: ".charts-container",
    start: "top 80%",
    onEnter: () => {
        // Запускаем плавную анимацию рендеринга Chart.js при достижении зоны видимости
        payloadChart.options.animation.duration = 1500;
        costChart.options.animation.duration = 1500;
        payloadChart.update();
        costChart.update();
    }
});
