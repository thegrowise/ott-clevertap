/* ==========================================================================
   CINESTREAM MAIN APPLICATION & OTT TELEMETRY ENGINE
   ========================================================================== */

window.App = {
  // Sample OTT Movies Catalog
  movies: [
    {
      id: "m1",
      title: "Cyberpunk 2099: Cyber Odyssey",
      genre: "Sci-Fi",
      rating: "4.9",
      year: "2026",
      duration: "2h 24m",
      quality: "4K HDR",
      poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80",
      desc: "In a dystopian neo-metropolis governed by AI lords, a rogue hacker discovers an encrypted memory code that could spark human resistance."
    },
    {
      id: "m2",
      title: "Shadows of the Abyss",
      genre: "Thriller",
      rating: "4.8",
      year: "2025",
      duration: "1h 58m",
      quality: "IMAX 4K",
      poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80",
      desc: "Deep sea marine biologists encounter an ancient bioluminescent structure miles under the ocean floor, unraveling secrets of Earth's genesis."
    },
    {
      id: "m3",
      title: "Interstellar Horizon",
      genre: "Sci-Fi",
      rating: "4.9",
      year: "2026",
      duration: "2h 45m",
      quality: "Dolby Vision",
      poster: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80",
      desc: "A crew of interstellar pioneers embarks on a high-risk warp passage through a supermassive wormhole."
    },
    {
      id: "m4",
      title: "The Silent Assassin",
      genre: "Action",
      rating: "4.7",
      year: "2025",
      duration: "2h 10m",
      quality: "4K HDR",
      poster: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=1600&auto=format&fit=crop&q=80",
      desc: "An elite spec-ops mercenary betrays his agency after learning of an insider conspiratorial blueprint."
    },
    {
      id: "m5",
      title: "Kingdom of Dragons",
      genre: "Fantasy",
      rating: "4.8",
      year: "2026",
      duration: "2h 30m",
      quality: "4K Ultra",
      poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=1600&auto=format&fit=crop&q=80",
      desc: "A young dragonlord must unite fractured warring clans before the frost-drake army breaches the Northern citadel."
    },
    {
      id: "m6",
      title: "Neon Pulse",
      genre: "Action",
      rating: "4.6",
      year: "2025",
      duration: "1h 48m",
      quality: "HD 1080p",
      poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80",
      desc: "Underground street racers test high-octane electromagnetic vehicles across Tokyo's illuminated night grid."
    }
  ],

  // Tracked Watch Progress Milestones
  milestonesTracked: {
    m25: false,
    m50: false,
    m75: false,
    m100: false
  },

  init: function () {
    this.renderPageComponents();
  },

  renderPageComponents: function () {
    // Check current page
    var path = window.location.pathname;

    if (path.endsWith('index.html') || path === '/' || path.endsWith('/sample-clvertap/')) {
      this.initHomePage();
    } else if (path.endsWith('browse.html')) {
      this.initBrowsePage();
    } else if (path.endsWith('watch.html')) {
      this.initWatchPage();
    } else if (path.endsWith('subscribe.html')) {
      this.initSubscribePage();
    } else if (path.endsWith('clevertap-push.html')) {
      this.initPushConsolePage();
    }
  },

  // ==========================================
  // 1. HOME PAGE LOGIC
  // ==========================================
  initHomePage: function () {
    var heroMovie = this.movies[0];

    var heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
      heroTitle.textContent = heroMovie.title;
      document.getElementById('hero-desc').textContent = heroMovie.desc;
      document.getElementById('hero-rating').textContent = heroMovie.rating;
      document.getElementById('hero-year').textContent = heroMovie.year;
      document.getElementById('hero-duration').textContent = heroMovie.duration;
      document.getElementById('hero-genre').textContent = heroMovie.genre;
      
      var heroBanner = document.getElementById('hero-banner');
      if (heroBanner) heroBanner.style.backgroundImage = `url('${heroMovie.banner}')`;

      document.getElementById('btn-hero-play').addEventListener('click', function () {
        CT.trackEvent('Hero Banner Clicked', {
          'Movie ID': heroMovie.id,
          'Movie Title': heroMovie.title,
          'Action': 'Play Now'
        });
        window.location.href = `watch.html?id=${heroMovie.id}`;
      });

      document.getElementById('btn-hero-watchlist').addEventListener('click', function () {
        CT.trackEvent('Watchlist Toggled', {
          'Movie ID': heroMovie.id,
          'Movie Title': heroMovie.title,
          'Action': 'Added to Watchlist'
        });
        alert(`"${heroMovie.title}" added to your watchlist! Event sent to CleverTap.`);
      });
    }

    // Render Trending Movies Grid
    var grid = document.getElementById('trending-grid');
    if (grid) {
      grid.innerHTML = this.movies.map(function (m) {
        return `
          <div class="movie-card" onclick="App.openWatchPage('${m.id}')">
            <div class="poster-wrapper">
              <span class="card-badge"><i class="fa-solid fa-star"></i> ${m.rating}</span>
              <img src="${m.poster}" alt="${m.title}" class="poster-img" loading="lazy" />
              <div class="play-overlay">
                <div class="play-icon-circle"><i class="fa-solid fa-play"></i></div>
              </div>
            </div>
            <div class="card-info">
              <div class="card-title">${m.title}</div>
              <div class="card-meta">
                <span class="card-genre">${m.genre}</span>
                <span>${m.quality}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  },

  openWatchPage: function (movieId) {
    var movie = this.movies.find(function (m) { return m.id === movieId; });
    if (movie) {
      CT.trackEvent('Movie Card Clicked', {
        'Movie ID': movie.id,
        'Movie Title': movie.title,
        'Genre': movie.genre
      });
    }
    window.location.href = `watch.html?id=${movieId}`;
  },

  // ==========================================
  // 2. BROWSE PAGE LOGIC
  // ==========================================
  initBrowsePage: function () {
    this.renderBrowseCatalog(this.movies);

    var searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        var query = e.target.value.toLowerCase();
        var filtered = App.movies.filter(function (m) {
          return m.title.toLowerCase().includes(query) || m.genre.toLowerCase().includes(query);
        });
        App.renderBrowseCatalog(filtered);

        if (query.length > 2) {
          CT.trackEvent('Catalog Searched', {
            'Search Query': query,
            'Results Count': filtered.length
          });
        }
      });
    }

    var chips = document.querySelectorAll('.genre-chips .chip');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');

        var genre = chip.getAttribute('data-genre');
        var filtered = (genre === 'All') ? App.movies : App.movies.filter(function (m) { return m.genre === genre; });
        App.renderBrowseCatalog(filtered);

        CT.trackEvent('Filter Applied', {
          'Filter Category': 'Genre',
          'Selected Genre': genre
        });
      });
    });
  },

  renderBrowseCatalog: function (items) {
    var catalogGrid = document.getElementById('browse-grid');
    if (!catalogGrid) return;

    if (items.length === 0) {
      catalogGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);">No movies found matching your search query.</div>`;
      return;
    }

    catalogGrid.innerHTML = items.map(function (m) {
      return `
        <div class="movie-card" onclick="App.openWatchPage('${m.id}')">
          <div class="poster-wrapper">
            <span class="card-badge"><i class="fa-solid fa-star"></i> ${m.rating}</span>
            <img src="${m.poster}" alt="${m.title}" class="poster-img" loading="lazy" />
            <div class="play-overlay">
              <div class="play-icon-circle"><i class="fa-solid fa-play"></i></div>
            </div>
          </div>
          <div class="card-info">
            <div class="card-title">${m.title}</div>
            <div class="card-meta">
              <span class="card-genre">${m.genre}</span>
              <span>${m.year} • ${m.quality}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  // ==========================================
  // 3. WATCH & PLAYER PAGE LOGIC
  // ==========================================
  initWatchPage: function () {
    var urlParams = new URLSearchParams(window.location.search);
    var movieId = urlParams.get('id') || 'm1';
    var movie = this.movies.find(function (m) { return m.id === movieId; }) || this.movies[0];

    document.getElementById('watch-title').textContent = movie.title;
    document.getElementById('watch-desc').textContent = movie.desc;
    document.getElementById('watch-genre').textContent = movie.genre;
    document.getElementById('watch-rating').textContent = movie.rating;

    // Track Video Start event
    CT.trackEvent('Media Details Viewed', {
      'Media ID': movie.id,
      'Media Title': movie.title,
      'Genre': movie.genre,
      'Quality': movie.quality
    });

    // Simulated Video Controls
    var isPlaying = false;
    var playBtn = document.getElementById('btn-player-play');
    var progressFill = document.getElementById('player-progress-fill');
    var timeDisplay = document.getElementById('player-time-display');
    var currentTimeSec = 0;
    var totalTimeSec = 144 * 60; // 2h 24m
    var timerInterval = null;

    if (playBtn) {
      playBtn.addEventListener('click', function () {
        isPlaying = !isPlaying;
        if (isPlaying) {
          playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
          CT.trackEvent('Media Play', {
            'Media ID': movie.id,
            'Media Title': movie.title,
            'Current Time Seconds': currentTimeSec
          });
          timerInterval = setInterval(function () {
            currentTimeSec += 60;
            if (currentTimeSec >= totalTimeSec) {
              currentTimeSec = totalTimeSec;
              isPlaying = false;
              playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
              clearInterval(timerInterval);
              CT.trackEvent('Media Completed', { 'Media ID': movie.id, 'Media Title': movie.title });
            }
            App.updatePlayerProgress(currentTimeSec, totalTimeSec, progressFill, timeDisplay, movie);
          }, 1000);
        } else {
          playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
          clearInterval(timerInterval);
          CT.trackEvent('Media Pause', {
            'Media ID': movie.id,
            'Media Title': movie.title,
            'Pause Time Seconds': currentTimeSec
          });
        }
      });
    }

    // Watchlist button
    var btnWatchlist = document.getElementById('btn-watch-add-list');
    if (btnWatchlist) {
      btnWatchlist.addEventListener('click', function () {
        CT.trackEvent('Watchlist Item Added', {
          'Media ID': movie.id,
          'Media Title': movie.title
        });
        alert(`"${movie.title}" added to your watchlist!`);
      });
    }
  },

  updatePlayerProgress: function (current, total, fillEl, textEl, movie) {
    var pct = (current / total) * 100;
    if (fillEl) fillEl.style.width = pct + '%';
    
    var currentMin = Math.floor(current / 60);
    var totalMin = Math.floor(total / 60);
    if (textEl) textEl.textContent = `${currentMin}m / ${totalMin}m`;

    // Track Milestone Telemetry
    if (pct >= 25 && !this.milestonesTracked.m25) {
      this.milestonesTracked.m25 = true;
      CT.trackEvent('Media 25% Watched', { 'Media ID': movie.id, 'Media Title': movie.title });
    }
    if (pct >= 50 && !this.milestonesTracked.m50) {
      this.milestonesTracked.m50 = true;
      CT.trackEvent('Media 50% Watched', { 'Media ID': movie.id, 'Media Title': movie.title });
    }
    if (pct >= 75 && !this.milestonesTracked.m75) {
      this.milestonesTracked.m75 = true;
      CT.trackEvent('Media 75% Watched', { 'Media ID': movie.id, 'Media Title': movie.title });
    }
  },

  // ==========================================
  // 4. SUBSCRIBE & CHECKOUT LOGIC
  // ==========================================
  initSubscribePage: function () {
    var buttons = document.querySelectorAll('.btn-select-plan');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var plan = btn.getAttribute('data-plan');
        var price = btn.getAttribute('data-price');
        App.openCheckoutModal(plan, price);
      });
    });

    var checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var planName = document.getElementById('checkout-plan-name').textContent;
        var amount = parseFloat(document.getElementById('checkout-plan-price').textContent);

        var chargeDetails = {
          "Amount": amount,
          "Charged ID": "ORD_" + Math.floor(100000 + Math.random() * 900000),
          "Payment Mode": "Credit Card",
          "Subscription Plan": planName,
          "Currency": "USD"
        };

        var items = [{
          "Item ID": "SUB_" + planName.toUpperCase(),
          "Item Name": planName + " Streaming Subscription",
          "Category": "OTT Subscription",
          "Price": amount,
          "Quantity": 1
        }];

        // PUSH CHARGED EVENT TO CLEVERTAP
        CT.trackCharged(chargeDetails, items);

        // PUSH PROFILE UPDATE
        CT.pushProfile({
          "Subscription Status": "Active",
          "Current Plan": planName,
          "Plan Expiry Date": new Date(Date.now() + 30*24*60*60*1000).toISOString()
        });

        App.closeCheckoutModal();
        alert(`🎉 Subscription successful for ${planName}! CleverTap Charged event sent.`);
      });
    }
  },

  openCheckoutModal: function (plan, price) {
    document.getElementById('checkout-plan-name').textContent = plan;
    document.getElementById('checkout-plan-price').textContent = price;
    var modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.add('active');

    CT.trackEvent('Subscription Plan Selected', {
      'Plan Name': plan,
      'Price': price
    });
  },

  closeCheckoutModal: function () {
    var modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.remove('active');
  },

  // ==========================================
  // 5. CLEVERTAP DEBUG CONSOLE LOGIC
  // ==========================================
  initPushConsolePage: function () {
    this.renderConsoleLogs();

    window.addEventListener('ct_log_updated', function () {
      App.renderConsoleLogs();
    });

    // Custom Event Push Form
    var eventForm = document.getElementById('console-event-form');
    if (eventForm) {
      eventForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('console-event-name').value.trim();
        var propsText = document.getElementById('console-event-props').value.trim();
        
        try {
          var props = propsText ? JSON.parse(propsText) : {};
          CT.trackEvent(name, props);
        } catch (err) {
          alert('Invalid JSON in event properties format.');
        }
      });
    }

    // Profile Push Form
    var profileForm = document.getElementById('console-profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var profileText = document.getElementById('console-profile-props').value.trim();
        try {
          var props = JSON.parse(profileText);
          CT.pushProfile(props);
        } catch (err) {
          alert('Invalid JSON in profile attributes format.');
        }
      });
    }

    // Clear Logs Button
    var btnClear = document.getElementById('btn-clear-logs');
    if (btnClear) {
      btnClear.addEventListener('click', function () {
        localStorage.removeItem('ct_event_history');
        App.renderConsoleLogs();
      });
    }
  },

  renderConsoleLogs: function () {
    var container = document.getElementById('terminal-log-container');
    if (!container) return;

    var logs = JSON.parse(localStorage.getItem('ct_event_history') || '[]');
    if (logs.length === 0) {
      container.innerHTML = `<div style="color:var(--text-dim);padding:1rem;">No events pushed yet. Interact with the website or use the forms on the left to push data to CleverTap.</div>`;
      return;
    }

    container.innerHTML = logs.map(function (log) {
      return `
        <div class="log-entry ${log.type}">
          <span class="log-timestamp">[${log.timestamp}]</span>
          <span class="log-type">${log.type.toUpperCase()}: ${log.title}</span>
          <pre class="log-json">${JSON.stringify(log.data, null, 2)}</pre>
        </div>
      `;
    }).join('');
  }
};

document.addEventListener('DOMContentLoaded', function () {
  App.init();
});
