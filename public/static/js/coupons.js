let couponsData; // Глобальная переменная для хранения данных о купонах
let cartItems = []; // Глобальная переменная для хранения товаров в корзине
let cartQuantitySpan; // Глобальная переменная для хранения ссылки на элемент счетчика в корзине

document.addEventListener("DOMContentLoaded", async function () {

    const mainSwiper = new Swiper(".main-slider", {
      direction: "horizontal",
      grabCursor: true,
      initialSlide: 2,
      spaceBetween: 52,
      loop: true,
      pagination: {
        el: ".main-slider__pagination",
        clickable: true,
      },
    });
  
    const couponsContainer = document.querySelector(".coupons-cont");
  
    function createCouponHTML(coupon) {
      return `
          <div class="swiper-slide coupon">
              <div class="coupon__img">
                  <img src="${coupon.image}" alt="Coupon image">
                  <span>
                      -${coupon.discount}%
                  </span>
              </div>
              <span class="coupon__desc">
                  ${coupon.name}
              </span>
              <div class="coupon-bottom">
                  <div class="coupon-bootom--left">
                      <span class="coupon__price">
                          ${coupon.crossedPrice.toLocaleString()} ₸
                      </span>
                      <span class="coupon__price--crossed">
                          ${calculateDiscountedPrice(
                            coupon.crossedPrice,
                            coupon.discount
                          ).toLocaleString()} ₸
                      </span>
                  </div>
                  <button class="coupon__addCart" onclick="addCart(${coupon.id})">
                      В корзину
                  </button>
              </div>
          </div>
      `;
    }
  
    function calculateDiscountedPrice(price, discount) {
      return Math.round(price / (1 - discount / 100));
    }
  
    function createCategorySwiper(category, coupons) {
        const couponContainer = document.createElement("div");
        couponContainer.classList.add("coupons-line", "swiper");
        couponContainer.id = category;

        const couponHTML = `
            <div class="coupons-line--top">
                <h3 class="coupons-line__title">
                    ${category}
                </h3>
                <div class="coupons-slider--control">
                    <div class="swiper-button-prev coupons-slider--arrow">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.6016 10.2L4.40156 10.2" stroke="#222224" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10 15.8L4.4 10.2L10 4.60005" stroke="#222224" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="swiper-button-next coupons-slider--arrow">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.39844 9.80005H15.5984" stroke="#222224" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10 4.19995L15.6 9.79995L10 15.4" stroke="#222224" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>                                                                               
                    </div>
                </div>
            </div>
            <div class="swiper-wrapper coupons-wrapper" data-category="${category}">
                ${coupons.map(createCouponHTML).join('')}
            </div>
        `;
  
      couponContainer.innerHTML = couponHTML;
      couponsContainer.appendChild(couponContainer);
  
      new Swiper(couponContainer, {
        direction: "horizontal",
        grabCursor: true,
        spaceBetween: 30,
        slidesPerView: 4,
        loop: false,
        navigation: {
          nextEl: couponContainer.querySelector(".swiper-button-next"),
          prevEl: couponContainer.querySelector(".swiper-button-prev"),
        },
        breakpoints: {
          1024: { slidesPerView: 4 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          480: { slidesPerView: 2, spaceBetween: 10 },
          0: { slidesPerView: 1 },
        },
      });
    }
  
    // Получаем ссылку на элемент счетчика корзины
    cartQuantitySpan = document.querySelector(".profile-cart__quantity");

    try {
      const response = await fetch("coupons.json");
      couponsData = await response.json();
  
      updateCartQuantity();
  
      for (const category in couponsData) {
        if (couponsData.hasOwnProperty(category)) {
          const coupons = couponsData[category];
          createCategorySwiper(category, coupons);
        }
      }
    } catch (error) {
      console.error("Error loading JSON:", error);
    }
});

function addCart(couponId) {
  const coupon = getCouponById(couponId);
  const cartItems = getCartItems();
  cartItems.push(coupon);
  saveCartItems(cartItems);
  updateCartQuantity();
}

function getCouponById(couponId) {
  for (const category in couponsData) {
    const coupon = couponsData[category].find((c) => c.id === couponId);
    if (coupon) {
      return coupon;
    }
  }
  return null;
}

function getCartItems() {
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith('cart='))
    ?.split('=')[1];

  return cookieValue ? JSON.parse(cookieValue) : [];
}

function saveCartItems(cartItems) {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  document.cookie = `cart=${JSON.stringify(cartItems)};expires=${expires.toUTCString()};path=/`;
  console.log("Cart items saved to cookies:", cartItems);
}

function updateCartQuantity() {
  const cartItems = getCartItems();
  if (cartQuantitySpan) {
    cartQuantitySpan.textContent = cartItems.length.toString();
  }
}