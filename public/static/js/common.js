document.addEventListener("DOMContentLoaded", function() {
    const header = document.querySelector('.header');
    const burgerMenu = document.querySelector('.header__burger-menu');
    const overlay = document.querySelector('.overlay');
    const close = document.querySelector('.header__nav-close');
    const openMenu = document.querySelector('.header__nav');
    let prevScroll = 0;
    let lastShowPos = 0;

    if (sessionStorage.getItem('headerClasses')) {
        header.className = sessionStorage.getItem('headerClasses');
    }

    window.addEventListener("scroll", function() {
        const scrolled = window.scrollY;
      
        if (scrolled > 70) {
            if (scrolled > prevScroll) {
                header.classList.add('header-out');
                lastShowPos = scrolled;
            } else if (scrolled <= lastShowPos - 50) {
                header.classList.remove('header-out');
                header.classList.add('header-fixed');
            }
        } else {
            header.classList.remove('header-fixed');
            header.classList.remove('header-out');
        }

        prevScroll = scrolled;

        sessionStorage.setItem('headerClasses', header.className);
    });
    
    burgerMenu.addEventListener('click', function(e) {
        e.preventDefault();
        openMenu.classList.add('translate');
        overlay.classList.add('block');
    });

    overlay.addEventListener('click', closeMenu);
    close.addEventListener('click', closeMenu);

    function closeMenu() {
        openMenu.classList.remove('translate');
        overlay.classList.remove('block');
    }

    const loginElement = document.querySelector('.nav-list__login');
    const profileElement = document.querySelector('.nav-list__profile');
    const profileNameElement = document.querySelector('.profile-name');
    const logoutButton = document.querySelector('.profile-logout');

    const userInfoString = localStorage.getItem('userInfo');

    if (userInfoString) {
        loginElement.style.display = 'none';
        profileElement.style.display = 'flex';
    } else {
        loginElement.style.display = 'block';
        profileElement.style.display = 'none';
    }

    const profileButton = document.querySelector('.profile__btn');
    const profileList = document.querySelector('.profile-list');

    profileButton.addEventListener('click', function(event) {
        event.stopPropagation();
        profileList.classList.toggle('hidden');
    });

    document.addEventListener('click', function(event) {
        if (!profileButton.contains(event.target)) {
            profileList.classList.add('hidden');
        }
    });

    document.addEventListener('scroll', function() {
        profileList.classList.add('hidden');
    });

    const userName = localStorage.getItem('userName');

    if (userName) {
        profileNameElement.innerHTML = userName;
    } else {
        console.log('Данные не найдены в localStorage');
    }

    logoutButton.addEventListener('click', function () {
        const logoutConfirm = confirm('Вы точно хотите выйти?')
        if(logoutConfirm) {
            localStorage.removeItem('userInfo');
            localStorage.removeItem('userName');
            window.location.reload();
        }
    });
});
