window.saveCartItems = function(cartItems) {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  // Устанавливаем куки
  document.cookie = `cart=${JSON.stringify(cartItems)};expires=${expires.toUTCString()};path=/`;

  console.log("Cart items saved to cookies:", cartItems);
};

const cartBoxes = document.querySelector(".cart-boxes");

function renderCartItems() {
  cartBoxes.innerHTML = "";

  const cartItems = getCartItems();

  const groupedItems = groupItemsById(cartItems);

  groupedItems.forEach((group) => {
    const cartItemHTML = createCartItemHTML(group);
    cartBoxes.innerHTML += cartItemHTML;
  });
}

function getCartItems() {
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith('cart='))
    ?.split('=')[1];

  return cookieValue ? JSON.parse(cookieValue) : [];
}

function groupItemsById(items) {
  const groupedItems = [];
  items.forEach((item) => {
    const existingGroup = groupedItems.find((group) => group.id === item.id);
    if (existingGroup) {
      existingGroup.quantity += 1;
      existingGroup.totalPrice += item.totalPrice;
    } else {
      groupedItems.push({ ...item, quantity: 1, totalPrice: item.totalPrice });
    }
  });
  return groupedItems;
}

function createCartItemHTML(group) {
  const { id, name, crossedPrice, discount, quantity, totalPrice } = group;

  const discountedPrice = calculateDiscountedPrice(crossedPrice, discount);

  return `
    <div class="cart-box cart-item" data-coupon-id="${id}">
        <div class="cart-item__name">
            <span>${name}</span>
        </div>
        <div class="cart-item__price">
            <span>${discountedPrice.toLocaleString()} ₸</span>
        </div>
        <div class="cart-item__quantity">
            <div class="cart-item__quantity--wrapper">
                <span class="cart-item__quantity-number" id="quantity-${id}">
                    ${quantity.toString().padStart(2, "0")}
                </span>
                <div class="cart-item__quantity-control">
                    <button class="cart-item__quantity-control__top" onclick="updateQuantity('${id}', 1)">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.75732 7.36666L4.45732 10.6667L3.51465 9.72399L7.75732 5.48132L12 9.72399L11.0573 10.6667L7.75732 7.36666Z" fill="black"/>
                        </svg>
                    </button>
                    <button class="cart-item__quantity-control__bottom" onclick="updateQuantity('${id}', -1)">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.24268 8.63334L11.5427 5.33334L12.4854 6.27601L8.24268 10.5187L4.00002 6.27601L4.94268 5.33334L8.24268 8.63334Z" fill="black"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <div class="cart-item__totalPrice" id="totalPrice-${id}">
            <span>${(quantity * discountedPrice).toLocaleString()} ₸</span>
        </div>
    </div>
  `;
}

function calculateDiscountedPrice(price, discount) {
  return Math.round(price / (1 - discount / 100));
}

function updateQuantity(couponId, change) {
  const quantityElement = document.getElementById(`quantity-${couponId}`);
  let quantity = parseInt(quantityElement.textContent, 10) + change;

  if (quantity <= 0) {
    const isConfirmed = confirm("Вы уверены, что хотите удалить этот купон из корзины?");
    if (isConfirmed) {
      removeCartItem(couponId);
      return;
    } else {
      quantity = 1;
    }
  }

  quantityElement.textContent = quantity.toString().padStart(2, "0");
  updateCartItem(couponId, quantity);
}

function updateCartQuantity() {
  const cartQuantitySpan = document.querySelector(".profile-cart__quantity");
  const cartItems = getCartItems();

  if (cartQuantitySpan) {
    cartQuantitySpan.textContent = cartItems.reduce((total, item) => total + item.quantity, 0).toString();
  }
}

renderCartItems();

async function removeCartItem(couponId) {
  const cartItems = getCartItems();
  const updatedCartItems = cartItems.filter((item) => item.id !== couponId);

  try {
    await saveCartItems(updatedCartItems);
    renderCartItems();
    updateCartQuantity();
  } catch (error) {
    console.error("Error removing cart item:", error);
  }
}

async function updateCartItem(couponId, quantity) {
  const cartItems = getCartItems();
  const cartItemIndex = cartItems.findIndex((item) => item.id === couponId);

  if (cartItemIndex !== -1) {
    cartItems[cartItemIndex].quantity = quantity;

    try {
      await saveCartItems(cartItems);
      renderCartItems(); 
      updateCartQuantity();
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  }
}