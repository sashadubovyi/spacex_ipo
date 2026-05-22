gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// Параллакс для блоков
document.querySelectorAll('[data-speed]').forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-speed'));
    const yValue = (1 - speed) * 300; 
    gsap.to(el, {
        y: yValue,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
    });
});

// Параллакс картинок
document.querySelectorAll('.gallery-item img').forEach((img) => {
    gsap.fromTo(img, { y: "-15%" }, {
        y: "15%", ease: "none",
        scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true }
    });
});

// Анимация текста (эффект проявления по словам)
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
        stagger: 0.05, // Ускорил анимацию для больших текстов
        ease: "none",
        scrollTrigger: {
            trigger: textBlock,
            start: "top 85%",
            end: "bottom 60%",
            scrub: true
        }
    });
});
