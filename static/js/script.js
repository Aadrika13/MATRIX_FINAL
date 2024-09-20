let lastScrollTop = 0;
const header = document.getElementById('main-header');

// Scroll Event Listener to show/hide header
window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        // Scrolling Down
        header.style.top = '-100px';  // Hide header
    } else {
        // Scrolling Up
        header.style.top = '0';  // Show header
    }
    lastScrollTop = scrollTop;
});
