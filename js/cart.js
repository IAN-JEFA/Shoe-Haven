// Format price to Kenyan Shillings
function formatPrice(price) {
    return `Ksh ${price.toLocaleString('en-KE')}`;
}

// Cart functionality
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');

// Function to update cart display in sidebar
function updateCartDisplay() {
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (cartTotalElement) cartTotalElement.textContent = formatPrice(0);
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">${formatPrice(item.price)} x ${item.quantity}</p>
                <p class="cart-item-total">${formatPrice(itemTotal)}</p>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Update total
    if (cartTotalElement) {
        cartTotalElement.textContent = formatPrice(total);
    }
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('.cart-item-remove').getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Function to remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    
    // Save to localStorage
    localStorage.setItem('shoehavenCart', JSON.stringify(cart));
    
    // Update cart count and display
    updateCartCount();
    updateCartDisplay();
    
    // Show notification
    showNotification('Item removed from cart');
}

// Function to update cart quantity
function updateCartQuantity(productId, newQuantity) {
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            cartItem.quantity = newQuantity;
            
            // Save to localStorage
            localStorage.setItem('shoehavenCart', JSON.stringify(cart));
            
            // Update cart count and display
            updateCartCount();
            updateCartDisplay();
        }
    }
}

// Initialize cart display if on checkout page
if (cartItemsContainer) {
    updateCartDisplay();
}

// Checkout page functionality
if (document.querySelector('.checkout-container')) {
    // Update checkout summary
    function updateCheckoutSummary() {
        const summaryItems = document.querySelector('.checkout-summary-items');
        const subtotalElement = document.getElementById('checkoutSubtotal');
        const shippingElement = document.getElementById('checkoutShipping');
        const totalElement = document.getElementById('checkoutTotal');
        
        if (!summaryItems || !subtotalElement) return;
        
        let subtotal = 0;
        summaryItems.innerHTML = '';
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const summaryItem = document.createElement('div');
            summaryItem.className = 'summary-item';
            summaryItem.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span>${formatPrice(itemTotal)}</span>
            `;
            summaryItems.appendChild(summaryItem);
        });
        
        const shipping = subtotal > 0 ? 299 : 0; // Shipping fee in Kenyan Shillings
        const tax = subtotal * 0.16; // 16% VAT in Kenya
        const total = subtotal + shipping + tax;
        
        subtotalElement.textContent = formatPrice(subtotal);
        if (shippingElement) shippingElement.textContent = formatPrice(shipping);
        if (document.getElementById('checkoutTax')) document.getElementById('checkoutTax').textContent = formatPrice(tax);
        if (totalElement) totalElement.textContent = formatPrice(total);
    }
    
    // Initialize checkout summary
    updateCheckoutSummary();
    
    // Checkout form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real app, you would process payment and order here
            // For now, just show a success message and clear the cart
            
            // Show success message
            showNotification('Order placed successfully! Thank you for your purchase.');
            
            // Clear cart
            cart = [];
            localStorage.removeItem('shoehavenCart');
            updateCartCount();
            updateCartDisplay();
            updateCheckoutSummary();
            
            // Reset form
            this.reset();
            
            // Redirect to home page after 3 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        });
    }
}