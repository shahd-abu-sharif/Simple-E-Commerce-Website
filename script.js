// Sample product data
const products = [
  { id: 1, name: 'Premium T-Shirt', price: 24.99, description: 'Soft cotton t-shirt with premium finish', image: 'https://i.pinimg.com/736x/06/10/57/06105729cf84798bc8f8b95168ab2f40.jpg' },
  { id: 2, name: 'Running Shoes', price: 89.99, description: 'Lightweight running shoes with cushioned soles', image: 'https://i.pinimg.com/736x/5b/02/67/5b0267104d729c60a34499d44f2c082a.jpg' },
  { id: 3, name: 'Baseball Cap', price: 19.99, description: 'Adjustable cap with breathable fabric', image: 'https://i.pinimg.com/736x/de/0f/4d/de0f4d4415dde7fca0aa6e034be3cddd.jpg' },
  { id: 4, name: 'Wireless Earbuds', price: 59.99, description: 'High-quality sound with noise cancellation', image: 'https://i.pinimg.com/736x/02/dc/a6/02dca654322b41109f1bfff157c116a1.jpg' },
  { id: 5, name: 'Smart Watch', price: 199.99, description: 'Track your fitness and notifications', image: 'https://i.pinimg.com/736x/66/cc/41/66cc412b365b9682e3c70881387d98bd.jpg' },
  { id: 6, name: 'Backpack', price: 49.99, description: 'Durable backpack with multiple compartments', image: 'https://i.pinimg.com/736x/3f/e8/2e/3fe82e9f4537e21349117c7fee51014a.jpg' } ,
   { id: 7, name: 'Gaming Mouse', price: 39.99, description: 'Ergonomic design with RGB lighting and high precision', image: 'https://i.pinimg.com/736x/a9/b5/d0/a9b5d041270b455954d2a5f6de13c8f1.jpg' },
  { id: 8, name: 'Water Bottle', price: 14.99, description: 'Insulated stainless steel bottle with 1-liter capacity', image: 'https://i.pinimg.com/736x/86/96/c0/8696c0d1568e0e8b69c01eb144a11497.jpg' }
];

let cart = [];
let filteredProducts = [...products]; // Used for search filtering

// Render product cards
function displayProducts() {
  const list = document.getElementById('product-list');
  list.innerHTML = '';

  filteredProducts.forEach(product => {
    const productElement = document.createElement('div');
    productElement.className = 'product';
    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
    list.appendChild(productElement);
  });
}

// Add product to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
}

// Remove product from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}

// Increase quantity by 1
function increaseQuantity(productId) {
  const item = cart.find(i => i.id === productId);
  if (item) item.quantity++;
  updateCart();
}

// Decrease quantity or remove item if quantity becomes 0
function decreaseQuantity(productId) {
  const item = cart.find(i => i.id === productId);
  if (item && item.quantity > 1) {
    item.quantity--;
  } else {
    removeFromCart(productId);
  }
  updateCart();
}

// Update cart summary and list
function updateCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
  document.getElementById('modal-cart-total').textContent = `$${total.toFixed(2)}`;

  const cartItems = document.getElementById('cart-items');
  const emptyMessage = document.getElementById('empty-cart-message');

  if (cart.length === 0) {
    cartItems.innerHTML = '';
    emptyMessage.style.display = 'block';
  } else {
    emptyMessage.style.display = 'none';
    cartItems.innerHTML = '';

    cart.forEach(item => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
          <div class="quantity-controls">
            <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
          </div>
        </div>
        <div>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
        </div>
      `;
      cartItems.appendChild(li);
    });
  }
}

// Search filter
function filterProducts(searchTerm) {
  const term = searchTerm.toLowerCase();
  filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term)
  );
  displayProducts();
}

// Listen for search input changes
document.getElementById('search-bar').addEventListener('input', e => {
  filterProducts(e.target.value);
});

// Show cart modal
function openCart() {
  document.getElementById('cart-modal').classList.add('visible');
}

// Hide cart modal
function closeCart() {
  document.getElementById('cart-modal').classList.remove('visible');
}

// Empty the cart
function clearCart() {
  if (confirm('Clear all items?')) {
    cart = [];
    updateCart();
    closeCart();
  }
}

// Finalize order
function checkout() {
  if (cart.length === 0) {
    alert('Cart is empty.');
    return;
  }

  alert(`Order placed! Total: $${calculateTotal().toFixed(2)}`);
  cart = [];
  updateCart();
  closeCart();
}

// Calculate total price
function calculateTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Open cart on icon click
document.getElementById('cart').addEventListener('click', openCart);

// Initial load
displayProducts();
updateCart();
