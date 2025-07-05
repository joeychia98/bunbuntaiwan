window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('shrink');
  } else {
    navbar.classList.remove('shrink');
  }
});

function updateCartCount(count) {
  const cartCount = document.getElementById('cart-count');
  cartCount.textContent = count;
  if (count > 0) {
    cartCount.classList.remove('hidden');
  } else {
    cartCount.classList.add('hidden');
  }
}
