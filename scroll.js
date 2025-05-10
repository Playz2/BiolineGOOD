let scrollAnimationFrame;
const carousel = document.getElementById('carousel');

// Mouse wheel horizontal scrolling
carousel.addEventListener('wheel', function (e) {
    e.preventDefault(); // Prevent vertical scrolling
    const scrollSpeedMultiplier = 3; // Increase scroll speed
    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;

    if ((carousel.scrollLeft >= maxScrollLeft && e.deltaY > 0) || 
        (carousel.scrollLeft <= 0 && e.deltaY < 0)) {
        // Allow default scrolling to the next or previous section
        window.scrollBy({
            top: e.deltaY,
            behavior: 'smooth'
        });
    } else {
        // Smooth horizontal scrolling within the carousel
        carousel.scrollBy({
            left: e.deltaY * scrollSpeedMultiplier,
            behavior: 'smooth'
        });
    }
}, { passive: false });

// Parallax scrolling effect
window.addEventListener('scroll', function () {
    if (scrollAnimationFrame) {
        cancelAnimationFrame(scrollAnimationFrame);
    }
    scrollAnimationFrame = requestAnimationFrame(() => {
        const scrollPosition = window.scrollY;
        const carouselSection = document.querySelector('.study-section');

        // Only scroll carousel when the section is in viewport
        const sectionTop = carouselSection.offsetTop;
        const sectionHeight = carouselSection.offsetHeight;
        const windowHeight = window.innerHeight;

        if (scrollPosition > sectionTop - windowHeight &&
            scrollPosition < sectionTop + sectionHeight) {
            // Calculate scroll position relative to the section
            const relativeScroll = scrollPosition - (sectionTop - windowHeight);
            const scrollSpeedMultiplier = 3; // Increase parallax scroll speed
            carousel.scrollLeft = relativeScroll * 2.8 * scrollSpeedMultiplier; // Smooth behavior is handled by CSS
        }
    });
});