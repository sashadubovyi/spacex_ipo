// Регистрация плагина ScrollTrigger в движке GSAP
gsap.registerPlugin(ScrollTrigger);

// 1. Инициализация плавного скролла Lenis (отключается/упрощается на старых тач-устройствах автоматически)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// 2. Глобальное появление блоков контента с классом .smooth-reveal
document.querySelectorAll('.smooth-reveal').forEach((block) => {
    gsap.fromTo(block, 
        { opacity: 0, y: 40 },
        {
            opacity: 1, 
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
                trigger: block,
                start: "top 90%",
                end: "top 70%",
                scrub: 1
            }
        }
    );
});

// ==========================================================================
// ДЕСКТОПНЫЙ ИНТЕРАКТИВ (РАБОТАЕТ СТРОГО ПРИ ШИРИНЕ ЭКРАНА ВЫШЕ 920px)
// ==========================================================================
if (window.innerWidth > 920) {
    
    // Анимация шагов в Hero секции
    const heroTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#heroSection",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        }
    });

    heroTl.to({}, { duration: 0.5 }) // Задержка первого кадра
          .classNameTween = gsap.utils.toArray(".hero-step-element");
          
    const steps = gsap.utils.toArray(".hero-step-element");
    steps.forEach((step, idx) => {
        if(idx > 0) {
            heroTl.to(steps[idx-1], { opacity: 0, scale: 0.95, duration: 0.5 }, idx * 1)
                  .to(step, { opacity: 1, scale: 1, visible: true, duration: 0.5 }, idx * 1);
        }
    });

    // Интерактивное перемещение точки по оси ракеты в секции Tech
    const techSteps = gsap.utils.toArray(".info-step");
    const techTrigger = gsap.timeline({
        scrollTrigger: {
            trigger: "#techSection",
            start: "top top",
            end: "bottom bottom",
            scrub: true
        }
    });

    // Движение светящегося маркера по SVG траектории ракеты
    techTrigger.fromTo("#rocketDot", { cy: 450 }, { cy: 50, ease: "none" });

    techSteps.forEach((step, idx) => {
        ScrollTrigger.create({
            trigger: step,
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () => {
                techSteps.forEach(s => s.classList.remove("active-tech"));
                step.classList.add("active-tech");
            },
            onEnterBack: () => {
                techSteps.forEach(s => s.classList.remove("active-tech"));
                step.classList.add("active-tech");
            }
        });
    });

    // Интерактивный таймлайн
    const tlSteps = gsap.utils.toArray(".tl-scrub-step");
    const timelineScrub = gsap.timeline({
        scrollTrigger: {
            trigger: "#timelineSection",
            start: "top top",
            end: "bottom bottom",
            scrub: true
        }
    });

    // Рост белой полосы прогресса по оси
    timelineScrub.to(".axis-progress-line", { height: "100%", ease: "none" });

    tlSteps.forEach((step, idx) => {
        const leftContent = step.querySelector(".left-side");
        const rightContent = step.querySelector(".right-side");
        
        const stepEnterTl = gsap.timeline({
            scrollTrigger: {
                trigger: "#timelineSection",
                start: () => `top+=${idx * window.innerHeight} top`,
                end: () => `top+=${(idx + 1) * window.innerHeight} top`,
                scrub: true,
                onToggle: (self) => {
                    if(self.isActive) {
                        step.classList.add("active-node");
                    } else {
                        step.classList.remove("active-node");
                    }
                }
            }
        });

        stepEnterTl.to(step, { opacity: 1, visible: true, duration: 0.2 });
        if(!leftContent.classList.contains("empty-side")) {
            stepEnterTl.fromTo(leftContent, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.6 }, "-=0.1");
        }
        if(!rightContent.classList.contains("empty-side")) {
            stepEnterTl.fromTo(rightContent, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.6 }, "-=0.1");
        }
        stepEnterTl.to({}, { duration: 0.4 }); // Фиксация видимости кадра
    });
}

// ==========================================================================
// ОБЩИЕ АНИМАЦИИ (РАБОТАЮТ НА ВСЕХ УСТРОЙСТВАХ, ОПТИМИЗИРОВАНО ПОД МОБИЛЬНЫЕ)
// ==========================================================================

// Анимация горизонтальных прогресс-баров капитализации
gsap.utils.toArray(".progress-bar-fill").forEach((bar) => {
    const targetWidth = bar.getAttribute("data-width");
    gsap.to(bar, {
        width: targetWidth,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
            trigger: bar,
            start: "top 90%",
            toggleActions: "play none none none"
        }
    });
});

// Анимация кругового монохромного графика и вылета описаний к нему
const revTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#revenueSection",
        start: "top 75%",
        toggleActions: "play none none none"
    }
});

const fullCircle = 251.2;

// 1. Сектор Starlink (77%) - Самый белый
revTl.to(".starlink-segment", {
    strokeDashoffset: fullCircle * (1 - 0.77),
    duration: 1.2,
    ease: "power2.out"
});

if (window.innerWidth > 920) {
    revTl.to("#revStep1", { opacity: 1, x: 0, duration: 0.5 }, "-=0.8");
}

// 2. Сектор Launch Services (15%) - Серый
revTl.to(".launch-segment", {
    strokeDashoffset: fullCircle * (1 - (0.77 + 0.15)),
    duration: 0.8,
    ease: "power2.out"
}, "-=0.3");

if (window.innerWidth > 920) {
    revTl.to("#revStep2", { opacity: 1, x: 0, duration: 0.5 }, "-=0.5");
}

// 3. Сектор Государственных контрактов (8%) - Темно-серый
revTl.to(".gov-segment", {
    strokeDashoffset: 0,
    duration: 0.6,
    ease: "power2.out"
}, "-=0.2");

if (window.innerWidth > 920) {
    revTl.to("#revStep3", { opacity: 1, x: 0, duration: 0.5 }, "-=0.4");
}
