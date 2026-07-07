// PHOENIX PROMPTS - Core JS Application Logic

// Initial Default Prompts Data
const DEFAULT_PROMPTS = [
  {
    id: "prompt_1",
    title: "Fox Girl on Moon",
    category: "Anime",
    tags: ["Moon", "Fantasy", "Night", "Fox Girl", "Beautiful", "4K", "Cinematic", "Female", "Purple", "Dream", "Wallpaper"],
    promptText: "A breathtaking digital painting of a beautiful anime fox girl with glowing violet tails, sitting gracefully on a giant glowing golden crescent moon. Starry cosmic sky, nebulae, floating stardust, cinematic lighting, soft purple and gold hues, masterpiece, 8k resolution, photorealistic details --ar 16:9 --v 6.0",
    price: 49,
    image: "assets/images/fox_girl_moon.png",
    author: "PHOENIX",
    created: "June 2026",
    visibility: "public",
    featured: true,
    rating: 5,
    ratingCount: 125,
    seoDescription: "Premium Midjourney prompt for generating a beautiful anime fox girl on a crescent moon with starry effects."
  },
  {
    id: "prompt_2",
    title: "Cyberpunk Detective",
    category: "Gaming",
    tags: ["Cyberpunk", "Neon", "Rain", "Detective", "Futuristic", "Realistic", "Male", "4K", "Night"],
    promptText: "A cinematic portrait of a gritty male cyberpunk detective standing in a dark rainy neo-tokyo alleyway. Neon signs glowing in cyan and hot pink, reflecting on wet asphalt. Holograms, cybernetic eye glowing amber, trench coat, holding a futuristic revolver, high contrast, volumetric haze, photo-realistic, unreal engine 5 render --ar 3:4 --v 6.0",
    price: 79,
    image: "assets/images/cyberpunk_detective.png",
    author: "PHOENIX",
    created: "May 2026",
    visibility: "public",
    featured: true,
    rating: 4.8,
    ratingCount: 94,
    seoDescription: "Unlock hyper-realistic cyberpunk detective midjourney prompt featuring dramatic wet-surface neon lighting."
  },
  {
    id: "prompt_3",
    title: "Cosmic Leviathan",
    category: "Fantasy",
    tags: ["Landscape", "Space", "Nebula", "Cosmic", "Stars", "Fantasy", "Dream"],
    promptText: "A gigantic glowing space whale gliding majestically through a vibrant cosmic nebula. Swirling dust clouds of magenta and deep indigo, exploding stars, asteroid belt, fantasy space landscape, dreamlike atmosphere, fine art style, extremely detailed, octane render, photorealistic --ar 16:9 --v 6.0",
    price: 0, // Free
    image: "assets/images/cosmic_leviathan.png",
    author: "PHOENIX",
    created: "June 2026",
    visibility: "public",
    featured: true,
    rating: 4.7,
    ratingCount: 231,
    seoDescription: "Breathtaking free Stable Diffusion prompt for a giant cosmic leviathan whale swimming in a colorful nebula."
  },
  {
    id: "prompt_4",
    title: "Neon Samurai",
    category: "Anime",
    tags: ["Samurai", "Cyberpunk", "Tokyo", "Katana", "Action", "Neon", "Purple", "Beautiful", "Female"],
    promptText: "A dynamic pose of a female cyber-samurai with glowing neon purple dual katanas. Cybernetic sleek carbon armor, standing on a Tokyo skyscraper ledge overlooking a futuristic skyline, dramatic wind blowing hair, high tech visor, action shot, anime key visual, highly detailed --ar 16:9 --v 6.0",
    price: 59,
    image: "assets/images/neon_samurai.png",
    author: "PHOENIX",
    created: "June 2026",
    visibility: "public",
    featured: true,
    rating: 4.9,
    ratingCount: 88,
    seoDescription: "Generate premium cyber-samurai action illustrations with this customizable Midjourney code."
  }
];

// App State
let state = {
  prompts: [],
  cart: [],
  wishlist: [],
  purchased: [],
  currentTab: "browse", // "browse" or "admin"
  activeFilters: {
    search: "",
    categories: [], // Selected category names
    priceType: "all", // "all", "free", "premium"
    activeTags: [], // Selected tags
    sort: "newest" // "newest", "popular", "trending"
  },
  activeDetailPromptId: null // Track currently open detail modal prompt
};

// Elements cache
const el = {
  promptsGrid: document.getElementById("prompts-grid"),
  resultsCount: document.getElementById("results-count"),
  searchHeader: document.getElementById("search-header"),
  searchSidebar: document.getElementById("search-sidebar"),
  categoriesList: document.getElementById("categories-list"),
  priceRadios: document.getElementsByName("price-filter"),
  sortSelect: document.getElementById("sort-select"),
  tagCloud: document.getElementById("tag-cloud"),
  
  // Tabs
  tabBrowse: document.getElementById("tab-browse"),
  heroSection: document.getElementById("hero-section"),
  
  // Drawers
  cartDrawer: document.getElementById("cart-drawer"),
  wishlistDrawer: document.getElementById("wishlist-drawer"),
  drawerOverlay: document.getElementById("drawer-overlay"),
  cartCount: document.getElementById("cart-count"),
  wishlistCount: document.getElementById("wishlist-count"),
  
  // Modals
  detailModal: document.getElementById("detail-modal"),
  paymentModal: document.getElementById("payment-modal"),
  paymentOverlay: document.getElementById("payment-overlay"),
  
  // Toast
};


// Initialize Application
function init() {
  loadLocalStorage();
  setupEventListeners();
  renderAll();
  showToast("Welcome to Phoenix Prompts!", "success");
}

// Local Storage Handlers
function loadLocalStorage() {
  // Prompts
  const storedPrompts = localStorage.getItem("phoenix_prompts");
  if (storedPrompts) {
    state.prompts = JSON.parse(storedPrompts);
  } else {
    state.prompts = [...DEFAULT_PROMPTS];
    savePrompts();
  }
  
  // Cart
  const storedCart = localStorage.getItem("phoenix_cart");
  state.cart = storedCart ? JSON.parse(storedCart) : [];
  
  // Wishlist
  const storedWishlist = localStorage.getItem("phoenix_wishlist");
  state.wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
  
  // Purchased / Unlocked
  const storedPurchased = localStorage.getItem("phoenix_purchased");
  state.purchased = storedPurchased ? JSON.parse(storedPurchased) : [];
}

function savePrompts() {
  localStorage.setItem("phoenix_prompts", JSON.stringify(state.prompts));
}

function saveCart() {
  localStorage.setItem("phoenix_cart", JSON.stringify(state.cart));
  updateBadges();
}

function saveWishlist() {
  localStorage.setItem("phoenix_wishlist", JSON.stringify(state.wishlist));
  updateBadges();
}

function savePurchased() {
  localStorage.setItem("phoenix_purchased", JSON.stringify(state.purchased));
}

function updateBadges() {
  if (el.cartCount) el.cartCount.textContent = state.cart.length;
  if (el.wishlistCount) el.wishlistCount.textContent = state.wishlist.length;
}

// Render Engine
function renderAll() {
  renderQuickCategories();
  renderFilters();
  renderPromptsGrid();
  updateBadges();
  renderCartDrawer();
  renderWishlistDrawer();
}

// Render Categories checkboxes & tag cloud dynamically based on public prompts
function renderFilters() {
  // 1. Categories
  const categories = [...new Set(state.prompts.map(p => p.category))];
  let catHtml = "";
  categories.forEach(cat => {
    const isChecked = state.activeFilters.categories.includes(cat) ? "checked" : "";
    catHtml += `
      <li>
        <label class="custom-checkbox-label">
          <input type="checkbox" class="custom-checkbox-input cat-filter-checkbox" value="${cat}" ${isChecked}>
          <span class="checkbox-box">&#10003;</span>
          ${cat}
        </label>
      </li>
    `;
  });
  if (el.categoriesList) el.categoriesList.innerHTML = catHtml;
  
  // 2. Tag Cloud
  const allTags = [];
  state.prompts.forEach(p => {
    if (p.visibility === 'public') {
      p.tags.forEach(t => allTags.push(t));
    }
  });
  
  // Unique tags with counts
  const tagCounts = {};
  allTags.forEach(t => {
    tagCounts[t] = (tagCounts[t] || 0) + 1;
  });
  
  // Sort tags by frequency and pick top 15
  const topTags = Object.keys(tagCounts).sort((a,b) => tagCounts[b] - tagCounts[a]).slice(0, 15);
  
  let tagHtml = "";
  topTags.forEach(tag => {
    const isActive = state.activeFilters.activeTags.includes(tag) ? "active" : "";
    tagHtml += `
      <span class="sidebar-tag ${isActive}" data-tag="${tag}">
        ${tag} (${tagCounts[tag]})
      </span>
    `;
  });
  if (el.tagCloud) el.tagCloud.innerHTML = tagHtml;
}

// Render horizontal category quick links in Hero Section
function renderQuickCategories() {
  const quickCatContainer = document.getElementById("quick-categories-container");
  if (!quickCatContainer) return;
  
  // Unique categories
  const categories = [...new Set(state.prompts.filter(p => p.visibility === 'public').map(p => p.category))];
  
  let html = `<button class="quick-cat-btn ${state.activeFilters.categories.length === 0 ? 'active' : ''}" data-cat="all">All Prompts</button>`;
  
  categories.forEach(cat => {
    const isActive = (state.activeFilters.categories.length === 1 && state.activeFilters.categories[0] === cat) ? 'active' : '';
    html += `<button class="quick-cat-btn ${isActive}" data-cat="${cat}">${cat}</button>`;
  });
  
  // Add a trending button
  html += `<button class="quick-cat-btn trending-btn" data-cat="trending">🔥 Trending</button>`;
  
  quickCatContainer.innerHTML = html;
}

// Render dynamic Prompt Cards Grid
function renderPromptsGrid() {
  if (!el.promptsGrid) return;
  
  const filteredPrompts = getFilteredPrompts();
  el.resultsCount.textContent = `${filteredPrompts.length} Prompt${filteredPrompts.length !== 1 ? 's' : ''} found`;
  
  if (filteredPrompts.length === 0) {
    el.promptsGrid.innerHTML = `
      <div class="drawer-empty-state" style="grid-column: 1 / -1; min-height: 300px;">
        <div class="drawer-empty-icon">&#128269;</div>
        <h3>No Prompts Found</h3>
        <p>Try clearing some filters or refining your search text.</p>
        <button class="btn btn-primary" id="btn-clear-all-filters">Reset Filters</button>
      </div>
    `;
    
    document.getElementById("btn-clear-all-filters")?.addEventListener("click", () => {
      state.activeFilters = {
        search: "",
        categories: [],
        priceType: "all",
        activeTags: [],
        sort: "newest"
      };
      
      // Reset inputs
      if (el.searchHeader) el.searchHeader.value = "";
      if (el.searchSidebar) el.searchSidebar.value = "";
      document.querySelectorAll(".cat-filter-checkbox").forEach(cb => cb.checked = false);
      const radioAll = document.querySelector('input[name="price-filter"][value="all"]');
      if (radioAll) radioAll.checked = true;
      if (el.sortSelect) el.sortSelect.value = "newest";
      
      renderAll();
    });
    return;
  }
  
  let gridHtml = "";
  filteredPrompts.forEach(p => {
    const isFree = p.price === 0;
    const isPurchased = state.purchased.includes(p.id);
    const inWishlist = state.wishlist.includes(p.id);
    const inCart = state.cart.some(item => item.id === p.id);
    
    // Status Badge
    let badgeHtml = "";
    if (isFree) {
      badgeHtml = `<span class="price-badge free">Free</span>`;
    } else if (isPurchased) {
      badgeHtml = `<span class="price-badge purchased">Unlocked</span>`;
    } else {
      badgeHtml = `<span class="price-badge premium">Premium</span>`;
    }
    
    // Price display
    let priceDisplay = isFree ? `<span class="card-price-value free-value">FREE</span>` : `<span class="card-price-value premium-value">₹${p.price}</span>`;
    if (!isFree && isPurchased) {
      priceDisplay = `<span class="card-price-value purchased-value">&#128275; Unlocked</span>`;
    }
    
    // Star rating
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.round(p.rating)) {
        stars += "&#9733;"; // filled star
      } else {
        stars += "&#9734;"; // empty star
      }
    }
    
    // Actions button
    let actionBtnHtml = "";
    if (isFree || isPurchased) {
      actionBtnHtml = `<button class="btn btn-primary btn-card-action" onclick="openDetailModal('${p.id}')">View Prompt</button>`;
    } else {
      if (inCart) {
        actionBtnHtml = `<button class="btn btn-secondary btn-card-action" onclick="openCartDrawer()">In Cart</button>`;
      } else {
        actionBtnHtml = `<button class="btn btn-gold btn-card-action" onclick="addToCart('${p.id}')">Buy ₹${p.price}</button>`;
      }
    }
    
    gridHtml += `
      <div class="prompt-card protected-preview" data-id="${p.id}">
        <div class="card-image-wrapper">
          ${badgeHtml}
          <button class="wishlist-pin ${inWishlist ? 'active' : ''}" onclick="toggleWishlist('${p.id}', event)" title="Add to Wishlist">
            &#9829;
          </button>
          <img class="card-image" src="${p.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500'}" alt="${p.title}" loading="lazy">
          ${(!isFree && !isPurchased) ? '<div class="card-watermark">PHOENIX PROMPTS</div>' : ''}
        </div>
        <div class="card-body">
          <div class="card-category" style="color: var(--accent-gold); font-size: 0.75rem; text-transform: uppercase; font-family: var(--font-heading);">${p.category}</div>
          <h3 class="card-title" onclick="openDetailModal('${p.id}')">${p.title}</h3>
          
          <div class="card-rating-container">
            <span class="stars">${stars}</span>
            <span class="rating-count">(${p.ratingCount})</span>
          </div>
          
          <div class="card-tags">
            ${p.tags.slice(0, 3).map(tag => `<span class="card-tag">${tag}</span>`).join('')}
          </div>
        </div>
        
        <div class="card-footer">
          ${priceDisplay}
          <div class="card-action-group">
            <button class="btn btn-secondary btn-card-preview" onclick="openDetailModal('${p.id}')">Preview</button>
            ${actionBtnHtml}
          </div>
        </div>
      </div>
    `;
  });
  
  el.promptsGrid.innerHTML = gridHtml;
}

// Compute filters & sorting logic
function getFilteredPrompts() {
  let list = state.prompts.filter(p => p.visibility === 'public');
  
  // 1. Search Query
  if (state.activeFilters.search.trim()) {
    const q = state.activeFilters.search.toLowerCase().trim();
    list = list.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.seoDescription.toLowerCase().includes(q) ||
      p.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }
  
  // 2. Categories
  if (state.activeFilters.categories.length > 0) {
    list = list.filter(p => state.activeFilters.categories.includes(p.category));
  }
  
  // 3. Price type
  if (state.activeFilters.priceType === "free") {
    list = list.filter(p => p.price === 0);
  } else if (state.activeFilters.priceType === "premium") {
    list = list.filter(p => p.price > 0);
  }
  
  // 4. Active tags
  if (state.activeFilters.activeTags.length > 0) {
    list = list.filter(p => 
      state.activeFilters.activeTags.every(tag => p.tags.includes(tag))
    );
  }
  
  // 5. Sorting
  if (state.activeFilters.sort === "newest") {
    // Rely on created date / index (for simulation, reverse array)
    list.sort((a, b) => b.id.localeCompare(a.id));
  } else if (state.activeFilters.sort === "popular") {
    list.sort((a, b) => b.ratingCount - a.ratingCount);
  } else if (state.activeFilters.sort === "trending") {
    list.sort((a, b) => (b.rating * b.ratingCount) - (a.rating * a.ratingCount));
  }
  
  return list;
}

// Wishlist Action Toggle
window.toggleWishlist = function(id, event) {
  if (event) event.stopPropagation();
  const index = state.wishlist.indexOf(id);
  if (index === -1) {
    state.wishlist.push(id);
    showToast("Added to Wishlist", "success");
  } else {
    state.wishlist.splice(index, 1);
    showToast("Removed from Wishlist", "info");
  }
  saveWishlist();
  renderAll();
};

// Cart Actions
window.addToCart = function(id) {
  const prompt = state.prompts.find(p => p.id === id);
  if (!prompt) return;
  
  if (prompt.price === 0) {
    showToast("This prompt is free! Unlock it directly.", "info");
    return;
  }
  
  if (state.purchased.includes(id)) {
    showToast("You already own this prompt!", "info");
    return;
  }
  
  if (state.cart.some(item => item.id === id)) {
    showToast("Prompt is already in your cart", "warning");
    return;
  }
  
  state.cart.push(prompt);
  saveCart();
  renderAll();
  showToast(`Added "${prompt.title}" to cart`, "success");
  openCartDrawer();
};

window.removeFromCart = function(id) {
  state.cart = state.cart.filter(item => item.id !== id);
  saveCart();
  renderAll();
  showToast("Removed from cart", "info");
};

// Render Cart Drawer
function renderCartDrawer() {
  const container = document.getElementById("cart-drawer-list");
  const subtotalVal = document.getElementById("cart-subtotal");
  const checkoutBtn = document.getElementById("cart-checkout-btn");
  if (!container) return;
  
  if (state.cart.length === 0) {
    container.innerHTML = `
      <div class="drawer-empty-state">
        <div class="drawer-empty-icon">&#128722;</div>
        <p>Your shopping cart is empty.</p>
        <button class="btn btn-primary" onclick="closeDrawers()">Browse Prompts</button>
      </div>
    `;
    subtotalVal.textContent = "₹0";
    checkoutBtn.disabled = true;
    return;
  }
  
  let html = "";
  let total = 0;
  state.cart.forEach(item => {
    total += item.price;
    html += `
      <div class="drawer-item">
        <img class="drawer-item-img" src="${item.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'}" alt="${item.title}">
        <div class="drawer-item-details">
          <span class="drawer-item-cat">${item.category}</span>
          <span class="drawer-item-title">${item.title}</span>
          <span class="drawer-item-price">₹${item.price}</span>
        </div>
        <button class="drawer-item-remove" onclick="removeFromCart('${item.id}')">&times;</button>
      </div>
    `;
  });
  
  container.innerHTML = html;
  subtotalVal.textContent = `₹${total}`;
  checkoutBtn.disabled = false;
  
  // Set up click handlers
  checkoutBtn.onclick = () => {
    closeDrawers();
    openPaymentModal(total, "cart");
  };
}

// Render Wishlist Drawer
function renderWishlistDrawer() {
  const container = document.getElementById("wishlist-drawer-list");
  if (!container) return;
  
  if (state.wishlist.length === 0) {
    container.innerHTML = `
      <div class="drawer-empty-state">
        <div class="drawer-empty-icon">&#9829;</div>
        <p>Your wishlist is empty.</p>
        <button class="btn btn-primary" onclick="closeDrawers()">Browse Prompts</button>
      </div>
    `;
    return;
  }
  
  let html = "";
  state.wishlist.forEach(id => {
    const item = state.prompts.find(p => p.id === id);
    if (!item) return;
    const isFree = item.price === 0;
    const isPurchased = state.purchased.includes(item.id);
    const inCart = state.cart.some(c => c.id === item.id);
    
    let actionBtn = "";
    if (isFree || isPurchased) {
      actionBtn = `<button class="btn btn-primary btn-icon-only" onclick="openDetailModal('${item.id}'); closeDrawers();" title="View Prompt">&#128275;</button>`;
    } else {
      if (inCart) {
        actionBtn = `<button class="btn btn-secondary btn-icon-only" onclick="openCartDrawer();" title="Go to Cart">&#128722;</button>`;
      } else {
        actionBtn = `<button class="btn btn-gold btn-icon-only" onclick="addToCart('${item.id}')" title="Add to Cart">&#128722;</button>`;
      }
    }
    
    html += `
      <div class="drawer-item">
        <img class="drawer-item-img" src="${item.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'}" alt="${item.title}">
        <div class="drawer-item-details">
          <span class="drawer-item-cat">${item.category}</span>
          <span class="drawer-item-title">${item.title}</span>
          <span class="drawer-item-price">${isFree ? 'FREE' : '₹' + item.price}</span>
        </div>
        <div style="display:flex; gap:0.5rem; align-items:center;">
          ${actionBtn}
          <button class="drawer-item-remove" onclick="toggleWishlist('${item.id}')">&times;</button>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// Drawer visibility control
window.openCartDrawer = function() {
  closeDrawers();
  el.drawerOverlay.classList.add("open");
  el.cartDrawer.classList.add("open");
};

window.openWishlistDrawer = function() {
  closeDrawers();
  el.drawerOverlay.classList.add("open");
  el.wishlistDrawer.classList.add("open");
};

window.closeDrawers = function() {
  el.drawerOverlay.classList.remove("open");
  el.cartDrawer.classList.remove("open");
  el.wishlistDrawer.classList.remove("open");
};

// Open Detail Page Modal
window.openDetailModal = function(id) {
  state.activeDetailPromptId = id;
  const p = state.prompts.find(item => item.id === id);
  if (!p) return;
  
  const isFree = p.price === 0;
  const isPurchased = state.purchased.includes(p.id);
  const inCart = state.cart.some(item => item.id === p.id);
  
  // 1. Watermark setup on preview pane
  const hasWatermark = !isFree && !isPurchased;
  const watermarkOverlayHtml = hasWatermark ? `
    <div class="detail-watermark-overlay">
      <div class="detail-watermark-row"><span>PHOENIX PROMPTS</span><span>PHOENIX PROMPTS</span></div>
      <div class="detail-watermark-row"><span>PREMIUM ONLY</span><span>PREMIUM ONLY</span></div>
      <div class="detail-watermark-row"><span>PHOENIX PROMPTS</span><span>PHOENIX PROMPTS</span></div>
    </div>
  ` : "";
  
  // 2. Prompt Area Render
  let promptAreaHtml = "";
  if (isFree || isPurchased) {
    promptAreaHtml = `
      <div class="prompt-box-wrapper">
        <div class="prompt-box-header">
          <span class="prompt-box-title">Prompt Instructions</span>
          <button class="btn btn-primary" onclick="copyPromptToClipboard('${p.id}')" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;">
            Copy Prompt
          </button>
        </div>
        <div class="prompt-box-content">
          <code class="unlocked-prompt-text" id="prompt-content-text">${escapeHtml(p.promptText)}</code>
        </div>
      </div>
    `;
  } else {
    // Locked screen
    let secondaryBtn = inCart 
      ? `<button class="btn btn-secondary" onclick="closeDetailModal(); openCartDrawer();" style="width: 100%;">Already in Cart</button>`
      : `<button class="btn btn-secondary" onclick="addToCart('${p.id}')" style="width: 100%;">Add to Cart</button>`;
      
    promptAreaHtml = `
      <div class="prompt-box-wrapper" style="position: relative; min-height: 200px;">
        <div class="prompt-box-header">
          <span class="prompt-box-title">Prompt Instructions</span>
        </div>
        <div class="locked-prompt-overlay">
          <span class="lock-icon">&#128274;</span>
          <span class="lock-message">Prompt Locked</span>
          <div style="display:flex; gap:1rem; width:80%;">
            <button class="btn btn-gold buy-btn-lock" onclick="buyPromptDirect('${p.id}')" style="flex:1;">Buy Now ₹${p.price}</button>
            <div style="flex:1;">
              ${secondaryBtn}
            </div>
          </div>
        </div>
        <div class="prompt-box-content" style="opacity: 0.15;">
          <code>A beautiful fox girl standing on a mountain peak... [LOCKED CONTENT - PURCHASE TO REVEAL]</code>
        </div>
      </div>
    `;
  }
  
  // Render full HTML
  const contentContainer = document.getElementById("detail-modal-content");
  contentContainer.innerHTML = `
    <div class="detail-grid">
      <div class="detail-image-pane">
        <img src="${p.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'}" alt="${p.title}" class="protected-preview">
        ${watermarkOverlayHtml}
      </div>
      
      <div class="detail-info-pane">
        <div>
          <span class="detail-category">${p.category}</span>
          <h2 class="detail-title">${p.title}</h2>
        </div>
        
        <div class="detail-metadata">
          <span class="meta-item">Author: <strong>${p.author}</strong></span>
          <span class="meta-item">Created: <strong>${p.created}</strong></span>
          <span class="meta-item">Price: <strong>${isFree ? 'FREE' : '₹' + p.price}</strong></span>
        </div>
        
        <div class="form-group">
          <span class="detail-tags-title">Tags</span>
          <div class="detail-tags-cloud">
            ${p.tags.map(tag => `<span class="detail-tag" onclick="filterByTag('${tag}')">${tag}</span>`).join('')}
          </div>
        </div>
        
        <div class="form-group">
          <span class="detail-tags-title">SEO Description</span>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">${p.seoDescription || 'No description available.'}</p>
        </div>
        
        ${promptAreaHtml}
      </div>
    </div>
    
    <!-- Related Prompts Section -->
    <div class="related-prompts-section">
      <h4 class="related-title">Related Prompts</h4>
      <div class="related-grid" id="related-prompts-grid"></div>
    </div>
  `;
  
  renderRelatedPrompts(p);
  
  el.detailModal.classList.add("open");
};

window.closeDetailModal = function() {
  el.detailModal.classList.remove("open");
  state.activeDetailPromptId = null;
};

// Render Related Prompts inside modal
function renderRelatedPrompts(activePrompt) {
  const grid = document.getElementById("related-prompts-grid");
  if (!grid) return;
  
  // Filter by category or overlapping tags
  let related = state.prompts.filter(p => 
    p.id !== activePrompt.id && 
    p.visibility === 'public' &&
    (p.category === activePrompt.category || p.tags.some(t => activePrompt.tags.includes(t)))
  );
  
  // Pick top 3
  related = related.slice(0, 3);
  
  if (related.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-secondary); font-size: 0.85rem;">No related prompts found.</p>`;
    return;
  }
  
  let html = "";
  related.forEach(p => {
    const isFree = p.price === 0;
    const isPurchased = state.purchased.includes(p.id);
    
    html += `
      <div class="prompt-card" onclick="openDetailModal('${p.id}')" style="cursor:pointer; transform:none; box-shadow:none;">
        <div class="card-image-wrapper" style="padding-bottom: 50%;">
          <img class="card-image" src="${p.image}" alt="${p.title}">
        </div>
        <div class="card-body" style="padding: 0.75rem;">
          <h5 style="font-size:0.9rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.title}</h5>
          <span style="font-size:0.8rem; color:${isFree ? '#2ed573' : (isPurchased ? '#886CFF' : 'var(--accent-gold)')}; font-weight:bold;">
            ${isFree ? 'FREE' : (isPurchased ? 'Unlocked' : '₹' + p.price)}
          </span>
        </div>
      </div>
    `;
  });
  
  grid.innerHTML = html;
}

// Copy prompt text code helper
window.copyPromptToClipboard = function(id) {
  const p = state.prompts.find(item => item.id === id);
  if (!p) return;
  
  if (p.price > 0 && !state.purchased.includes(p.id)) {
    showToast("Purchase required to copy prompt!", "error");
    return;
  }
  
  navigator.clipboard.writeText(p.promptText).then(() => {
    showToast("Prompt copied to clipboard!", "success");
  }).catch(() => {
    showToast("Failed to copy prompt automatically", "error");
  });
};

// Filter by clicking detail modal tag
window.filterByTag = function(tag) {
  closeDetailModal();
  state.activeFilters.activeTags = [tag];
  // Reset other filters for simple tag focus
  state.activeFilters.categories = [];
  state.activeFilters.search = "";
  
  // Highlight
  document.querySelectorAll(".cat-filter-checkbox").forEach(cb => cb.checked = false);
  if (el.searchHeader) el.searchHeader.value = "";
  
  renderAll();
};

// Purchase simulation flow
let currentPaymentContext = {
  amount: 0,
  type: "cart", // "cart" or "single"
  singlePromptId: null
};

window.openPaymentModal = function(amount, type, singleId = null) {
  currentPaymentContext = { amount, type, singlePromptId: singleId };
  
  document.getElementById("payment-value-display").textContent = amount;
  
  el.paymentOverlay.classList.add("open");
  el.paymentModal.classList.add("open");
};

window.closePaymentModal = function() {
  el.paymentOverlay.classList.remove("open");
  el.paymentModal.classList.remove("open");
};

window.buyPromptDirect = function(id) {
  const p = state.prompts.find(item => item.id === id);
  if (!p) return;
  
  closeDetailModal();
  openPaymentModal(p.price, "single", p.id);
};

// Handle Payment form submission
document.getElementById("payment-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const cardName = document.getElementById("pay-name").value;
  const cardNumber = document.getElementById("pay-card").value;
  
  if (!cardName.trim() || !cardNumber.trim()) {
    showToast("Please enter card details.", "error");
    return;
  }
  
  // Show processing animation on button
  const payBtn = document.getElementById("submit-payment-btn");
  const originalText = payBtn.innerHTML;
  payBtn.disabled = true;
  payBtn.innerHTML = `<span class="logo-icon" style="animation: spin 1s linear infinite; display:inline-block; font-size:1rem; margin:0;">&#8635;</span> Processing...`;
  
  setTimeout(() => {
    // Process complete
    payBtn.disabled = false;
    payBtn.innerHTML = originalText;
    
    if (currentPaymentContext.type === "cart") {
      // Unlock all items in cart
      state.cart.forEach(item => {
        if (!state.purchased.includes(item.id)) {
          state.purchased.push(item.id);
        }
      });
      state.cart = [];
      saveCart();
    } else if (currentPaymentContext.type === "single") {
      const id = currentPaymentContext.singlePromptId;
      if (id && !state.purchased.includes(id)) {
        state.purchased.push(id);
      }
    }
    
    savePurchased();
    closePaymentModal();
    renderAll();
    
    showToast("Payment Successful! Prompts Unlocked.", "success");
    
    // If we bought a single prompt, open detail modal back up to show unlocked state!
    if (currentPaymentContext.type === "single" && currentPaymentContext.singlePromptId) {
      setTimeout(() => {
        openDetailModal(currentPaymentContext.singlePromptId);
      }, 500);
    }
  }, 2000); // 2 seconds processing animation
});

function formatCurrentMonth() {
  const date = new Date();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Security features
function setupSecurity() {
  // 1. Disable Right Click on images and prompt cards
  document.addEventListener("contextmenu", (e) => {
    // Check if target is inside protected elements
    if (e.target.closest(".protected-preview") || e.target.tagName === 'IMG') {
      e.preventDefault();
      showToast("Right-click protection is active to secure designs.", "warning");
    }
  });
  
  // 2. Prevent copying text outside of unlocked prompt area
  document.addEventListener("copy", (e) => {
    // Allow copy strictly inside .unlocked-prompt-text
    const isWithinUnlockedText = window.getSelection().anchorNode && 
                                  window.getSelection().anchorNode.parentElement.closest(".unlocked-prompt-text");
    if (!isWithinUnlockedText) {
      e.preventDefault();
      showToast("Text copying is disabled for protected areas.", "warning");
    }
  });
  
  // 3. Disable text selection except in unlocked prompt box
  document.addEventListener("selectstart", (e) => {
    const isWithinUnlockedText = e.target.closest(".unlocked-prompt-text");
    if (!isWithinUnlockedText) {
      // Allow select in form inputs and text areas
      const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.getAttribute('contenteditable') === 'true';
      if (!isInput) {
        e.preventDefault();
      }
    }
  });
}

// Event Listeners Setup
function setupEventListeners() {
  
  // Search inputs
  el.searchHeader?.addEventListener("input", (e) => {
    state.activeFilters.search = e.target.value;
    renderPromptsGrid();
  });
  
  el.searchSidebar?.addEventListener("input", (e) => {
    state.activeFilters.search = e.target.value;
    if (el.searchHeader) el.searchHeader.value = e.target.value;
    renderPromptsGrid();
  });
  
  // Category Quick Link click delegation
  document.getElementById("quick-categories-container")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".quick-cat-btn");
    if (!btn) return;
    
    const cat = btn.getAttribute("data-cat");
    
    // Reset tags
    state.activeFilters.activeTags = [];
    
    if (cat === "all") {
      state.activeFilters.categories = [];
      state.activeFilters.sort = "newest";
    } else if (cat === "trending") {
      state.activeFilters.categories = [];
      state.activeFilters.sort = "trending";
    } else {
      state.activeFilters.categories = [cat];
      state.activeFilters.sort = "newest";
    }
    
    // Sync sidebar checkboxes
    document.querySelectorAll(".cat-filter-checkbox").forEach(cb => {
      cb.checked = state.activeFilters.categories.includes(cb.value);
    });
    
    renderAll();
  });
  
  // Sidebar Category Filter Checkboxes
  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("cat-filter-checkbox")) {
      const checkedBoxes = document.querySelectorAll(".cat-filter-checkbox:checked");
      state.activeFilters.categories = Array.from(checkedBoxes).map(cb => cb.value);
      renderAll();
    }
  });
  
  // Sidebar Price Radio Filter
  document.querySelectorAll('input[name="price-filter"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
      state.activeFilters.priceType = e.target.value;
      renderPromptsGrid();
    });
  });
  
  // Sorting selection
  el.sortSelect?.addEventListener("change", (e) => {
    state.activeFilters.sort = e.target.value;
    renderPromptsGrid();
  });
  
  // Sidebar Tag Cloud Click delegation
  el.tagCloud?.addEventListener("click", (e) => {
    const tagSpan = e.target.closest(".sidebar-tag");
    if (!tagSpan) return;
    
    const tag = tagSpan.getAttribute("data-tag");
    const index = state.activeFilters.activeTags.indexOf(tag);
    
    if (index === -1) {
      state.activeFilters.activeTags.push(tag);
    } else {
      state.activeFilters.activeTags.splice(index, 1);
    }
    
    renderAll();
  });
  
  
  // Close Modals on click outside or close button click
  window.addEventListener("click", (e) => {
    if (e.target === el.detailModal) closeDetailModal();
    if (e.target === el.paymentOverlay) closePaymentModal();
    if (e.target === el.drawerOverlay) closeDrawers();
  });
  
  setupSecurity();
}


// Custom Toast System
function showToast(message, type = "info") {
  if (!el.toastContainer) return;
  
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let icon = "&#8505;"; // Info
  if (type === "success") icon = "&#10004;";
  if (type === "warning") icon = "&#9888;";
  if (type === "error") icon = "&#10008;";
  
  toast.innerHTML = `<span style="font-size:1.1rem; font-weight:bold;">${icon}</span> <span>${message}</span>`;
  el.toastContainer.appendChild(toast);
  
  // Fade out and remove
  setTimeout(() => {
    toast.classList.add("fade-out");
    toast.addEventListener("animationend", () => {
      toast.remove();
    });
  }, 4000);
}

// Utilities
function escapeHtml(string) {
  return String(string).replace(/[&<>"']/g, function (s) {
    const entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return entityMap[s];
  });
}

// Run initialization on page load
document.addEventListener("DOMContentLoaded", init);
