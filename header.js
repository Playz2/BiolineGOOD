document.addEventListener('DOMContentLoaded', function() {
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    // Add a class to enable smooth transitions
    header.style.transition = 'transform 0.3s ease-in-out';
    
    window.addEventListener('scroll', function() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // If scrolling down and not at the very top
      if (scrollTop > lastScrollTop && scrollTop > 50) {
        // Hide the header by moving it up (out of view)
        header.style.transform = 'translateY(-200%)';
      } else {
        // When scrolling up or at the top, show the header
        header.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = scrollTop;
    });
  });