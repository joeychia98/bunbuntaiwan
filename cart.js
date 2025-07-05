let cart = JSON.parse(localStorage.getItem('checkoutCart')) || [];

function toggleCart() {
    const cartBox = document.getElementById('cart-box');
    cartBox.classList.toggle('hidden');

  const cartList = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartCount = document.getElementById('cart-count');

  if (cart.length === 0) {
    cartList.innerHTML = '<p style="padding: 1em; text-align:center;">你的購物車是空的</p>';
    cartTotal.innerText = '';
    cartCount.classList.add('hidden');
  } else {
    updateCartUI();
  }
}

function addToCart(event) {
  const button = event.target;
  const mealCard = button.closest(".menu-card");

  const basePrice = parseFloat(button.dataset.price);
  const mainName = button.dataset.main;

  const setSelect = mealCard.querySelector(".set");
  const setValue = setSelect ? setSelect.value : "單點";
  const isSetMeal = setValue !== "單點";

  const addonSelect = mealCard.querySelector(".addon");
  const addon = addonSelect ? addonSelect.value : "不加購";
  const addonPrice = addonSelect ? parseFloat(addonSelect.selectedOptions[0].dataset.price) || 0 : 0;

  let set = "單點";
  let drink = "";
  let setAdd = 0;
  let drinkAdd = 0;

  if (isSetMeal) {
    set = setValue;
    const setOption = setSelect.selectedOptions[0];
    setAdd = parseFloat(setOption.dataset.price) || 0;

    const drinkSection = mealCard.querySelector(".drink-section");
    const drinkSelect = mealCard.querySelector(".setdrink");

    if (drinkSection && drinkSection.style.display !== "none" && drinkSelect && drinkSelect.value !== "") {
      drink = drinkSelect.value;
      const drinkOption = drinkSelect.selectedOptions[0];
      drinkAdd = parseFloat(drinkOption.dataset.price) || 0;
    }
  }

  const qty = parseInt(mealCard.querySelector(".qty").value);

  const totalPrice = (basePrice + setAdd + drinkAdd + addonPrice) * qty;

  // 把套餐跟飲料也加到名稱方便顯示辨識
  const fullName = `${mainName} (${set}${drink ? " + " + drink : ""}${addon !== "不加購" ? " + " + addon : ""})`;


  const existingItem = cart.find(item =>
    item.name === fullName &&
    item.set === set &&
    item.drink === drink &&
    item.addon === addon 
  );

  if (existingItem) {
    existingItem.quantity += qty;
    existingItem.subtotal = existingItem.quantity * existingItem.price;
  } else {
    const item = {
      id: Date.now(),
      name: fullName,
      set,
      drink,
      addon,
      addonPrice,
      quantity: qty,
      price: basePrice + setAdd + drinkAdd + addonPrice,
      subtotal: totalPrice
    };
    cart.push(item);
  }
  updateCartUI();

   localStorage.setItem('checkoutCart', JSON.stringify(cart));
}


function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();

    localStorage.setItem('checkoutCart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartList = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    cartList.innerHTML = '';

    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item-card');
        itemDiv.innerHTML = `
          <div><strong> ${item.name}</strong>
          <div>套餐: ${item.set}</div>
           ${item.drink ? `<div>飲料: ${item.drink}</div>` : ''}
          <div>
          <div>${item.addon && item.addon !== "不加購" ? `<div>加購: ${item.addon}</div>` : ''}</div>
            數量:  <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="cart-qty-input" />
            <button onclick="removeFromCart(${index})" class="remove-btn">
          <i class = "fas fa-trash-alt"></i>
          </button>
          </div>
        `;
        cartList.appendChild(itemDiv);
    });

    updateCartTotalAndCount();

    document.querySelectorAll('.cart-qty-input').forEach(input => {
        input.addEventListener('change', (e) => {
           const idx = parseInt(e.target.dataset.index);
           const newQty = parseInt(e.target.value);

           if (isNaN(newQty) || newQty <1 ){
            e.target.value = cart[idx].quantity;
            return;
           }

           cart[idx].quantity = newQty;
           cart[idx].subtotal = cart[idx].price * newQty;
           updateCartTotalAndCount();
        });
    });

     localStorage.setItem('checkoutCart', JSON.stringify(cart));
}

function updateCartTotalAndCount() {
    const totalEl = document.getElementById('cart-total');
    let total = 0;
    cart.forEach(item =>{
        total += item.price * item.quantity;
    });
    totalEl.innerText = `總金額: NT${total.toFixed(2)}`;
    const cartCountEl = document.getElementById('cart-count');
    cartCountEl.innerText = cart.length;
    cartCountEl.classList.toggle('hidden', cart.length === 0);


     localStorage.setItem('checkoutCart', JSON.stringify(cart));
}

function checkout() {
  if (cart.length === 0) {
    alert('購物車是空的，請先加入餐點');
    return;
  }

  localStorage.setItem('checkoutCart', JSON.stringify(cart));

  window.location.href = 'checkout.html';
}

window.onload = function() {
   document.querySelectorAll('.add-item').forEach(button => {
    button.addEventListener('click', addToCart);
 });

  updateCartUI();

};
