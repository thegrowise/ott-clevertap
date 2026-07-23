/* ==========================================================================
   CINESTREAM SHOP & ACTION BUTTONS CLEVERTAP DEMO JS
   ========================================================================== */

(function () {
  'use strict';

  // Sample Products Data
  var PRODUCTS = [
    {
      id: "PROD-001",
      name: "Cyber Odyssey 4K Collector's Box",
      category: "Merchandise",
      price: 49.99,
      badge: "BESTSELLER",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80",
      description: "Exclusive physical Blu-ray collector set with signed cyberpunk artwork."
    },
    {
      id: "PROD-002",
      name: "Neon VR Hologram Headset",
      category: "Hardware",
      price: 199.00,
      badge: "FEATURED",
      image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=500&auto=format&fit=crop&q=80",
      description: "Next-gen immersive virtual reality headset with spatial audio integration."
    },
    {
      id: "PROD-003",
      name: "CineStream VIP Cinema Pass",
      category: "Subscriptions",
      price: 29.99,
      badge: "POPULAR",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80",
      description: "Unlimited access to all live premiere events and exclusive director commentary."
    },
    {
      id: "PROD-004",
      name: "Neural Nexus LED Hoodie",
      category: "Apparel",
      price: 79.50,
      badge: "LIMITED",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=80",
      description: "Smart apparel with responsive RGB cyber lighting syncable to film soundtracks."
    }
  ];

  // Cart State
  var cartItems = [];

  // Initialize Page
  document.addEventListener('DOMContentLoaded', function () {
    loadCartFromStorage();
    renderProducts();
    renderCart();
    setupPageVisitTracker();
    setupLoginForm();
  });

  // Automatically Track Page Visit on Load
  function setupPageVisitTracker() {
    // Push automatic page visit
    if (window.CT && window.CT.trackEvent) {
      window.CT.trackEvent('Page Visited', {
        'Page Name': 'CleverTap Action Buttons & Store Page',
        'Page Type': 'E-Commerce & Action Console',
        'Referrer': document.referrer || 'Direct Entry',
        'URL Path': window.location.pathname
      });
    }

    // Manual Page Visit Action Buttons
    var btnVisitShop = document.getElementById('btn-visit-shop');
    var btnVisitDeals = document.getElementById('btn-visit-deals');
    var btnVisitTech = document.getElementById('btn-visit-tech');

    if (btnVisitShop) {
      btnVisitShop.addEventListener('click', function () {
        CT.trackEvent('Page Visited', {
          'Section Name': 'Shop Main Catalog',
          'Visit Trigger': 'Manual Button Click',
          'Active Category': 'All Products'
        });
      });
    }

    if (btnVisitDeals) {
      btnVisitDeals.addEventListener('click', function () {
        CT.trackEvent('Page Visited', {
          'Section Name': 'Flash Deals & Discounts',
          'Visit Trigger': 'Manual Button Click',
          'Discount Tier': '25% Off Cyber Pass'
        });
      });
    }

    if (btnVisitTech) {
      btnVisitTech.addEventListener('click', function () {
        CT.trackEvent('Page Visited', {
          'Section Name': 'VR & Hardware Gear',
          'Visit Trigger': 'Manual Button Click',
          'Category Filter': 'Hardware'
        });
      });
    }
  }

  // Render Product Catalog
  function renderProducts() {
    var container = document.getElementById('products-grid');
    if (!container) return;

    container.innerHTML = PRODUCTS.map(function (p) {
      return `
        <div class="product-card">
          <div class="product-img-wrapper">
            <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" />
            <span class="product-badge">${p.badge}</span>
          </div>
          <div class="product-content">
            <span class="product-cat">${p.category}</span>
            <h3 class="product-title">${p.name}</h3>
            <p class="product-desc">${p.description}</p>
            
            <div class="product-price-row">
              <span class="product-price">$${p.price.toFixed(2)}</span>
              <span class="product-id">${p.id}</span>
            </div>
            
            <div class="product-actions">
              <button class="btn btn-sm btn-primary btn-add-cart" data-id="${p.id}">
                <i class="fa-solid fa-cart-plus"></i> Add to Cart
              </button>
              <button class="btn btn-sm btn-glass btn-view-details" data-id="${p.id}">
                <i class="fa-solid fa-eye"></i> View Details
              </button>
              <button class="btn btn-sm btn-glass btn-wishlist" data-id="${p.id}" title="Add to Wishlist">
                <i class="fa-solid fa-heart"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach Event Listeners to Product Buttons
    container.querySelectorAll('.btn-add-cart').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-id');
        addToCart(id);
      });
    });

    container.querySelectorAll('.btn-view-details').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-id');
        var product = getProductById(id);
        if (product) {
          CT.trackEvent('Product Viewed', {
            'Product ID': product.id,
            'Product Name': product.name,
            'Category': product.category,
            'Price': product.price
          });
        }
      });
    });

    container.querySelectorAll('.btn-wishlist').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-id');
        var product = getProductById(id);
        if (product) {
          CT.trackEvent('Added to Wishlist', {
            'Product ID': product.id,
            'Product Name': product.name,
            'Category': product.category,
            'Price': product.price
          });
        }
      });
    });
  }

  function getProductById(id) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) return PRODUCTS[i];
    }
    return null;
  }

  // Add Item to Cart & Push CleverTap Event
  function addToCart(productId) {
    var product = getProductById(productId);
    if (!product) return;

    var existing = null;
    for (var i = 0; i < cartItems.length; i++) {
      if (cartItems[i].id === productId) {
        existing = cartItems[i];
        break;
      }
    }

    if (existing) {
      existing.quantity += 1;
    } else {
      cartItems.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: 1
      });
    }

    saveCartToStorage();
    renderCart();

    // PUSH CLEVERTAP "Added to Cart" EVENT
    CT.trackEvent('Added to Cart', {
      'Product ID': product.id,
      'Product Name': product.name,
      'Category': product.category,
      'Price': product.price,
      'Cart Total Items': getCartTotalCount(),
      'Source': 'Shop Page Action Button'
    });
  }

  function getCartTotalCount() {
    return cartItems.reduce(function (total, item) {
      return total + item.quantity;
    }, 0);
  }

  function getCartTotalPrice() {
    return cartItems.reduce(function (total, item) {
      return total + (item.price * item.quantity);
    }, 0);
  }

  function renderCart() {
    var cartBadge = document.getElementById('cart-badge');
    var cartItemsContainer = document.getElementById('cart-items-container');
    var cartTotalEl = document.getElementById('cart-total-price');
    var btnCheckout = document.getElementById('btn-cart-checkout');
    var btnClear = document.getElementById('btn-cart-clear');

    var totalCount = getCartTotalCount();
    var totalPrice = getCartTotalPrice();

    if (cartBadge) cartBadge.textContent = totalCount;
    if (cartTotalEl) cartTotalEl.textContent = '$' + totalPrice.toFixed(2);

    if (!cartItemsContainer) return;

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <i class="fa-solid fa-basket-shopping" style="font-size: 2.5rem; color: var(--text-dim); margin-bottom: 0.5rem;"></i>
          <p>Your shopping cart is currently empty.</p>
          <span style="font-size: 0.8rem; color: var(--text-dim);">Click <strong>Add to Cart</strong> buttons above to trigger CleverTap E-commerce events.</span>
        </div>
      `;
      if (btnCheckout) btnCheckout.disabled = true;
      if (btnClear) btnClear.disabled = true;
      return;
    }

    if (btnCheckout) btnCheckout.disabled = false;
    if (btnClear) btnClear.disabled = false;

    cartItemsContainer.innerHTML = cartItems.map(function (item) {
      return `
        <div class="cart-item-row">
          <div class="cart-item-info">
            <span class="cart-item-title">${item.name}</span>
            <span class="cart-item-meta">${item.category} &bull; $${item.price.toFixed(2)} x ${item.quantity}</span>
          </div>
          <div class="cart-item-actions">
            <span class="cart-item-subtotal">$${(item.price * item.quantity).toFixed(2)}</span>
            <button class="btn-remove-item" data-id="${item.id}" title="Remove Item">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Remove Item Event Listener
    cartItemsContainer.querySelectorAll('.btn-remove-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-id');
        removeFromCart(id);
      });
    });

    if (btnClear && !btnClear.dataset.bound) {
      btnClear.dataset.bound = "true";
      btnClear.addEventListener('click', function () {
        if (cartItems.length > 0) {
          CT.trackEvent('Cart Cleared', {
            'Items Removed Count': totalCount,
            'Total Cart Value Abandoned': totalPrice
          });
          cartItems = [];
          saveCartToStorage();
          renderCart();
        }
      });
    }

    if (btnCheckout && !btnCheckout.dataset.bound) {
      btnCheckout.dataset.bound = "true";
      btnCheckout.addEventListener('click', handleCheckout);
    }
  }

  function removeFromCart(productId) {
    var removedItem = null;
    cartItems = cartItems.filter(function (item) {
      if (item.id === productId) {
        removedItem = item;
        return false;
      }
      return true;
    });

    saveCartToStorage();
    renderCart();

    if (removedItem) {
      CT.trackEvent('Removed from Cart', {
        'Product ID': removedItem.id,
        'Product Name': removedItem.name,
        'Category': removedItem.category,
        'Price': removedItem.price
      });
    }
  }

  // Handle Checkout / Charged Event
  function handleCheckout() {
    if (cartItems.length === 0) return;

    var chargeDetails = {
      "Amount": getCartTotalPrice(),
      "Charged ID": "ORD-CT-" + Math.floor(100000 + Math.random() * 900000),
      "Payment Mode": "Credit Card / Digital Wallet",
      "Coupon Applied": "CYBER20",
      "Currency": "USD"
    };

    var itemsPayload = cartItems.map(function (item) {
      return {
        "Category": item.category,
        "Quantity": item.quantity,
        "Price": item.price,
        "Product Name": item.name,
        "Product ID": item.id
      };
    });

    // PUSH CLEVERTAP CHARGED EVENT
    CT.trackCharged(chargeDetails, itemsPayload);

    // Reset Cart
    cartItems = [];
    saveCartToStorage();
    renderCart();
  }

  function saveCartToStorage() {
    try {
      localStorage.setItem('cinestream_cart', JSON.stringify(cartItems));
    } catch (e) {}
  }

  function loadCartFromStorage() {
    try {
      var stored = localStorage.getItem('cinestream_cart');
      if (stored) {
        cartItems = JSON.parse(stored);
      }
    } catch (e) {
      cartItems = [];
    }
  }

  // Setup Detailed User Login & Profile Push Form
  function setupLoginForm() {
    var loginForm = document.getElementById('shop-user-login-form');
    var btnPushProfileOnly = document.getElementById('btn-push-profile-only');
    var btnFillSampleData = document.getElementById('btn-fill-sample-user');

    if (btnFillSampleData) {
      btnFillSampleData.addEventListener('click', function () {
        document.getElementById('form-user-identity').value = 'CT_USER_' + Math.floor(1000 + Math.random() * 9000);
        document.getElementById('form-user-name').value = 'Elena Rostova';
        document.getElementById('form-user-email').value = 'elena.rostova@example.com';
        document.getElementById('form-user-phone').value = '+14159876543';
        document.getElementById('form-user-gender').value = 'F';
        document.getElementById('form-user-tier').value = 'VIP Platinum';
        document.getElementById('form-user-genre').value = 'Sci-Fi';
        document.getElementById('form-msg-push').checked = true;
        document.getElementById('form-msg-sms').checked = true;
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var identity = document.getElementById('form-user-identity').value.trim() || ('CT_USER_' + Math.floor(1000 + Math.random() * 9000));
        var name = document.getElementById('form-user-name').value.trim() || 'Alex Mercer';
        var email = document.getElementById('form-user-email').value.trim() || 'alex.mercer@example.com';
        var phone = document.getElementById('form-user-phone').value.trim() || '+14155552671';
        var gender = document.getElementById('form-user-gender').value || 'M';
        var tier = document.getElementById('form-user-tier').value || 'Premium 4K';
        var genre = document.getElementById('form-user-genre').value || 'Sci-Fi';
        var msgPush = document.getElementById('form-msg-push').checked;
        var msgSms = document.getElementById('form-msg-sms').checked;

        var userData = {
          "Name": name,
          "Identity": identity,
          "Email": email,
          "Phone": phone,
          "Gender": gender,
          "Subscription Tier": tier,
          "Preferred Genre": genre,
          "MSG-push": msgPush,
          "MSG-email": true,
          "MSG-sms": msgSms,
          "Login Location": "Action Studio Page",
          "Last Login Date": new Date().toLocaleDateString()
        };

        // Save session
        if (window.Auth) {
          Auth.currentUser = userData;
          localStorage.setItem('cinestream_user', JSON.stringify(userData));
          Auth.renderHeaderAuthUI();
        }

        // PUSH ON USER LOGIN TO CLEVERTAP
        CT.loginUser(userData);
      });
    }

    if (btnPushProfileOnly) {
      btnPushProfileOnly.addEventListener('click', function () {
        var genre = document.getElementById('form-user-genre').value || 'Sci-Fi';
        var tier = document.getElementById('form-user-tier').value || 'Premium 4K';

        var profileData = {
          "Favorite Category": genre,
          "Membership Level": tier,
          "Profile Updated Date": new Date().toISOString(),
          "Last Action Performed": "Clicked Push Profile Button"
        };

        // PUSH PROFILE ATTRIBUTES TO CLEVERTAP
        CT.pushProfile(profileData);
      });
    }
  }

})();
