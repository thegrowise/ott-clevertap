/* ==========================================================================
   CLEVERTAP WEB SDK CONFIGURATION & HELPER WRAPPER
   Account ID: 867-88W-K87Z
   Account Token: 0bb-a6b
   Passcode: SMQ-KQE-GIEL
   Region: global
   ========================================================================== */

// 1. CleverTap Initialization Snippet
var clevertap = window.clevertap || {
  event: [],
  profile: [],
  account: [],
  onUserLogin: [],
  notifications: [],
  privacy: []
};

// Configure CleverTap Credentials
clevertap.account.push({ 
  "id": "867-88W-K87Z",
  "token": "0bb-a6b"
});

// Set privacy settings & verbose logging
clevertap.privacy.push({ optOut: false });
clevertap.privacy.push({ useIP: true });
clevertap.loglevel = 3; // Enable verbose CleverTap debug log output in DevTools Console

// Load CleverTap SDK script asynchronously (Always use HTTPS)
(function () {
  var wzrk = document.createElement('script');
  wzrk.type = 'text/javascript';
  wzrk.async = true;
  wzrk.src = 'https://d2r1yp2w7bby2u.cloudfront.net/js/clevertap.min.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wzrk, s);
})();

// 2. Global CineStream CleverTap Helper (CT)
window.CT = {
  // Account Info
  accountDetails: {
    id: "867-88W-K87Z",
    token: "0bb-a6b",
    passcode: "SMQ-KQE-GIEL",
    region: "global"
  },

  // Track Custom Event
  trackEvent: function (eventName, eventProps) {
    var props = eventProps || {};
    props["Source Platform"] = "Web OTT";
    props["Page URL"] = window.location.pathname;
    props["Timestamp"] = new Date().toISOString();

    console.log('[CleverTap Event Pushed]:', eventName, props);
    clevertap.event.push(eventName, props);

    this.showToast('EVENT PUSHED', eventName, props);
    this.logToHistory('event', eventName, props);
  },

  // Update User Profile
  pushProfile: function (profileProps) {
    var payload = { "Site": profileProps };
    console.log('[CleverTap Profile Pushed]:', payload);
    clevertap.profile.push(payload);

    this.showToast('PROFILE UPDATED', 'User Profile Attributes', profileProps);
    this.logToHistory('profile', 'Profile Updated', profileProps);
  },

  // Login User (onUserLogin)
  loginUser: function (userData) {
    var payload = { "Site": userData };
    console.log('[CleverTap onUserLogin Pushed]:', payload);
    clevertap.onUserLogin.push(payload);

    this.showToast('ON USER LOGIN', userData.Name || userData.Identity || 'User Logged In', userData);
    this.logToHistory('login', 'User Logged In', userData);
  },

  // Track E-Commerce Charged Event
  trackCharged: function (chargeDetails, items) {
    console.log('[CleverTap Charged Pushed]:', chargeDetails, items);
    clevertap.event.push("Charged", chargeDetails, items);

    this.showToast('CHARGED EVENT', 'Order #' + chargeDetails["Charged ID"], { details: chargeDetails, items: items });
    this.logToHistory('event', 'Charged', { details: chargeDetails, items: items });
  },

  // Toast HUD notification UI
  showToast: function (type, title, payload) {
    var hud = document.getElementById('ct-toast-hud');
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'ct-toast-hud';
      hud.className = 'ct-toast-hud';
      document.body.appendChild(hud);
    }

    var toast = document.createElement('div');
    toast.className = 'ct-toast';
    
    var jsonString = JSON.stringify(payload, null, 2);
    
    toast.innerHTML = `
      <div class="toast-header">
        <span><i class="fa-solid fa-bolt" style="color:#e50914;margin-right:5px;"></i> ${title}</span>
        <span class="toast-tag">${type}</span>
      </div>
      <div class="toast-body">Sent to CleverTap (ID: 867-88W-K87Z)</div>
      <pre class="toast-code">${jsonString}</pre>
    `;

    hud.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.4s ease';
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 4500);
  },

  // Log events to localStorage for the Debug Console page
  logToHistory: function (type, title, data) {
    var logs = JSON.parse(localStorage.getItem('ct_event_history') || '[]');
    logs.unshift({
      timestamp: new Date().toLocaleTimeString(),
      type: type,
      title: title,
      data: data
    });
    if (logs.length > 50) logs.pop();
    localStorage.setItem('ct_event_history', JSON.stringify(logs));

    // Dispatch custom event for real-time console listeners
    window.dispatchEvent(new CustomEvent('ct_log_updated'));
  }
};

// Track initial Page View event automatically
document.addEventListener('DOMContentLoaded', function () {
  var pageName = document.title || 'OTT Page';
  CT.trackEvent('Page Viewed', {
    'Page Name': pageName,
    'Page Path': window.location.pathname
  });
});
