// js/ui-helpers.js
window.CT_UI = {
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
    
    var jsonString = payload ? JSON.stringify(payload, null, 2) : "{}";
    
    toast.innerHTML = `
      <div class="toast-header">
        <span><i class="fa-solid fa-bolt" style="color:#e50914;margin-right:5px;"></i> ${title}</span>
        <span class="toast-tag">${type}</span>
      </div>
      <div class="toast-body">Sent to Growise</div>
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

// Global Click Tracking for Growise
document.addEventListener('click', function(e) {
  var target = e.target;
  // find nearest actionable element
  var el = target.closest('button, a, input[type="submit"], input[type="button"], .movie-card, .btn');
  if (el) {
    var text = el.innerText || el.value || el.getAttribute('aria-label') || el.title || '';
    text = text.trim().substring(0, 100);
    var tag = el.tagName ? el.tagName.toLowerCase() : 'unknown';
    var id = el.id || '';
    var classes = (typeof el.className === 'string') ? el.className : '';
    
    if (window.growise && window.growise.track) {
      growise.track('element_clicked', {
        'element_text': text,
        'element_tag': tag,
        'element_id': id,
        'element_class': classes,
        'page_url': window.location.pathname
      });
    }
  }
});
