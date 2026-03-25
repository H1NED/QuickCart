document.addEventListener("DOMContentLoaded", function() {
    initSwipers();
    initCategoryButtons();
    initFAQAccordion();
});

function initSwipers() {
    const mainSwiper = new Swiper('.main-right--swiper', {
        direction: 'horizontal',
        grabCursor: true,
        initialSlide: 1,
        slidesPerView: 3, 
        centeredSlides: true,
        spaceBetween: 32,  
        pagination: {
            el: '.main-right--swiper-pagination',
            clickable: true,
        },
    });

    const categorySlider = new Swiper('.tranding-slider', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        initialSlide: 3,
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 4,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
    });
}

function initCategoryButtons() {
    const categoryBtns = document.querySelectorAll(".category-list__btn");
    const trandingSlides = document.querySelectorAll('.tranding-slide');

    categoryBtns.forEach(button => {
        button.addEventListener('click', handleCategoryButtonClick);
    });

    function handleCategoryButtonClick() {
        categoryBtns.forEach(btn => {
            btn.classList.remove("category-list__btn-active");
        });

        this.classList.add("category-list__btn-active");

        const contentId = this.getAttribute("data-content");

        Array.from(trandingSlides).forEach((slide, index) => {
            const { newSrc, newText } = getContentDetails(contentId, index);
            const imageElement = slide.querySelector(".tranding-slide-img img");
            const textElement = slide.querySelector(".tranding-slide__title");

            imageElement.src = newSrc;
            textElement.textContent = newText;
        });
    }
}

function initFAQAccordion() {
    const faqs = document.querySelectorAll('.faq-list__item');

    faqs.forEach(faq => {
        faq.addEventListener('click', () => {
            faq.classList.toggle('faq-list__item--active');
        });
    });
}

function getContentDetails(contentId, index) {
    const textData = {
        food: ["Пицца", "Панкейки", "Торты", "Фрикадельки", "Бургер", "Рыба", "Донер"],
        sport: ["Футбол", "Баскетбол", "Волейбол", "Бокс", "Тренажерный зал", "Дзюдо", "Гандбол"],
        health: ["Массаж", "Стоматология", "Солевая пещера", "Санаторий", "Узи", "МРТ", "Анализы"],
        tourism: ["Отели", "Отдых за городом", "Билеты", "Дача", "Сарыагаш", "Буровое", "Легенда"],
        services: ["Химчистка", "Языковые курсы", "Автоуслуги", "Консультация", "Онлайн курсы", "Курсы для детей", "Фото, видео курсы"],
        product: ["Цветы", "Игрушки", "Обувь", "Одежда", "Периферия", "Смартфоны", "Ноутбуки"]
    };

    const categoryData = textData[contentId] || textData.food;
    const defaultText = `Новый текст для ${contentId || 'категории'}`;

    const categoryId = Object.keys(textData).indexOf(contentId) + 1;

    return {
        newSrc: `../static/img/slider/categorySlider${categoryId}_${index + 1}.jpg`,
        newText: categoryData[index] || defaultText
    };
}
