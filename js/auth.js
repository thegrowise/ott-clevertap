/* ==========================================================================
   CINESTREAM AUTHENTICATION & CLEVERTAP IDENTITY MANAGER
   ========================================================================== */

window.Auth = {
  // Current user state
  currentUser: null,

  init: function () {
    this.loadUserFromStorage();
    this.renderHeaderAuthUI();
    this.setupEventListeners();
  },

  // Read saved user session
  loadUserFromStorage: function () {
    var stored = localStorage.getItem('cinestream_user');
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
      } catch (e) {
        this.currentUser = null;
      }
    }
  },

  // Render navigation bar user badge or login button
  renderHeaderAuthUI: function () {
    var authContainer = document.getElementById('nav-auth-container');
    if (!authContainer) return;

    if (this.currentUser) {
      var initial = (this.currentUser.Name || 'U').charAt(0).toUpperCase();
      authContainer.innerHTML = `
        <div class="user-profile-badge">
          <div class="user-avatar">${initial}</div>
          <span class="user-name-text">${this.currentUser.Name || 'Streamer'}</span>
          <button class="btn-logout" id="btn-logout" title="Logout">
            <i class="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      `;
      document.getElementById('btn-logout').addEventListener('click', this.logout.bind(this));
    } else {
      authContainer.innerHTML = `
        <button class="btn-login" id="btn-open-login">
          <i class="fa-solid fa-user"></i> Login / Register
        </button>
      `;
      document.getElementById('btn-open-login').addEventListener('click', this.openLoginModal.bind(this));
    }
  },

  // Open login modal
  openLoginModal: function () {
    var modal = document.getElementById('login-modal');
    if (modal) modal.classList.add('active');
  },

  // Close login modal
  closeLoginModal: function () {
    var modal = document.getElementById('login-modal');
    if (modal) modal.classList.remove('active');
  },

  // Handle Login form submit
  handleLoginSubmit: function (e) {
    e.preventDefault();

    var name = document.getElementById('input-name').value.trim() || 'Alex Mercer';
    var email = document.getElementById('input-email').value.trim() || 'alex.mercer@example.com';
    var phone = document.getElementById('input-phone').value.trim() || '+14155552671';
    var identity = document.getElementById('input-identity').value.trim() || 'CT_USER_' + Math.floor(1000 + Math.random() * 9000);
    var genre = document.getElementById('input-genre').value || 'Sci-Fi';
    var plan = document.getElementById('input-plan').value || 'Premium 4K';

    var userData = {
      "Name": name,
      "Identity": identity,
      "Email": email,
      "Phone": phone,
      "Preferred Genre": genre,
      "Subscription Tier": plan,
      "Account Created": new Date().toLocaleDateString(),
      "MSG-push": true
    };

    // Save to localStorage
    this.currentUser = userData;
    localStorage.setItem('cinestream_user', JSON.stringify(userData));

    // PUSH TO CLEVERTAP VIA onUserLogin
    CT.loginUser(userData);

    // Also push custom profile attributes
    CT.pushProfile({
      "Last Login Date": new Date().toISOString(),
      "User Type": "Registered Streamer"
    });

    this.closeLoginModal();
    this.renderHeaderAuthUI();

    // Trigger page re-render callback if present
    window.dispatchEvent(new CustomEvent('user_auth_changed', { detail: userData }));
  },

  // Handle Logout
  logout: function () {
    if (this.currentUser) {
      CT.trackEvent('User Logged Out', {
        'User Email': this.currentUser.Email,
        'Identity': this.currentUser.Identity
      });
    }

    this.currentUser = null;
    localStorage.removeItem('cinestream_user');

    this.renderHeaderAuthUI();
    window.dispatchEvent(new CustomEvent('user_auth_changed', { detail: null }));
  },

  setupEventListeners: function () {
    var closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', this.closeLoginModal.bind(this));

    var form = document.getElementById('login-form');
    if (form) form.addEventListener('submit', this.handleLoginSubmit.bind(this));

    var modal = document.getElementById('login-modal');
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) window.Auth.closeLoginModal();
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', function () {
  Auth.init();
});
