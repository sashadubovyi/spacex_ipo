// Регистрируем плагин ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Инициализируем Lenis для плавного скроллинга (современная альтернатива Locomotive)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Интеграция Lenis и GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// 1. Глобальный параллакс для элементов с атрибутом data-speed
const parallaxElements = document.querySelectorAll('[data-speed]');

parallaxElements.forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-speed'));
    const yValue = (1 - speed) * 300; 
    
    gsap.to(el, {
        y: yValue,
        ease: "none",
        scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true
        }
    });
});

// 2. Внутренний параллакс для изображений (фирменный стиль andyhardy.co)
const galleryImages = document.querySelectorAll('.gallery-item img');

galleryImages.forEach((img) => {
    gsap.fromTo(img, {
        y: "-15%" // Начинаем чуть выше
    }, {
        y: "15%", // Заканчиваем чуть ниже
        ease: "none",
        scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});

// 3. Эффект плавного появления текста по словам
const revealText = document.querySelector('.reveal-text');
if (revealText) {
    const textContent = revealText.textContent;
    revealText.innerHTML = '';
    
    // Разбиваем текст на отдельные слова
    const words = textContent.trim().split(' ');
    words.forEach(word => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.style.opacity = 0.15; // Прозрачность неактивного текста
        revealText.appendChild(span);
    });

    const spans = revealText.querySelectorAll('span');
    
    // Анимируем прозрачность при скролле
    gsap.to(spans, {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: {
            trigger: revealText,
            start: "top 80%",
            end: "bottom 50%",
            scrub: true
        }
    });
}
