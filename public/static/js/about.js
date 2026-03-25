document.addEventListener("DOMContentLoaded", function() {
    const mainSwiper = new Swiper('.gallery-slider', {
        direction: 'horizontal',
        grabCursor: true,
        spaceBetween: 44,  
        loop: true,

        navigation: {
            nextEl: '.gallery-navigation__next',
            prevEl: '.gallery-navigation__prev',
        }
    });

    videojs(document.querySelector('.about-video'), {  
        language: 'ru',
    }); 
});
