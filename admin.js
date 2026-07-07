// PHOENIX PROMPTS - Separate Admin Dashboard Logic

// Initial Default Prompts Data (in case localStorage is cleared)
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
    price: 0,
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

// Admin State
let prompts = [];
let uploadedImageBase64 = "";

// Element Selectors
const el = {
  adminForm: document.getElementById("admin-form"),
  formPromptId: document.getElementById("form-prompt-id"),
  formTitle: document.getElementById("form-title"),
  formPromptText: document.getElementById("form-prompt"),
  formCategory: document.getElementById("form-category"),
  formTags: document.getElementById("form-tags"),
  formPrice: document.getElementById("form-price"),
  formVisibility: document.getElementById("form-visibility"),
  formFeatured: document.getElementById("form-featured"),
  formSeoDesc: document.getElementById("form-seo-desc"),
  imageUpload: document.getElementById("image-upload"),
  imagePreview: document.getElementById("image-preview"),
  adminTableBody: document.getElementById("admin-table-body"),
  formSubmitBtn: document.getElementById("form-submit-btn"),
  btnResetForm: document.getElementById("btn-reset-form"),
  formModeTitle: document.getElementById("admin-form-mode-title"),
  
  // Hero stat counters
  statTotal: document.getElementById("stat-total"),
  statPublic: document.getElementById("stat-public"),
  statFree: document.getElementById("stat-free"),
  statFeatured: document.getElementById("stat-featured"),
  
  // Navigation badges
  cartCount: document.getElementById("cart-count"),
  wishlistCount: document.getElementById("wishlist-count"),
  toastContainer: document.getElementById("toast-container"),
  
  // Auth Elements
  adminAppContainer: document.getElementById("admin-app-container"),
  adminLoginOverlay: document.getElementById("admin-login-overlay"),
  adminLoginForm: document.getElementById("admin-login-form"),
  adminPasswordInput: document.getElementById("admin-password"),
  btnLogout: document.getElementById("btn-logout")
};

// Initialize Admin Dashboard
function init() {
  checkAuth();
  loadLocalStorage();
  setupEventListeners();
  renderAll();
}

// Check admin authentication state
function checkAuth() {
  const isAuth = sessionStorage.getItem("phoenix_admin_auth") === "true";
  if (isAuth) {
    if (el.adminAppContainer) el.adminAppContainer.style.display = "flex";
    if (el.adminLoginOverlay) el.adminLoginOverlay.style.display = "none";
  } else {
    if (el.adminAppContainer) el.adminAppContainer.style.display = "none";
    if (el.adminLoginOverlay) el.adminLoginOverlay.style.display = "flex";
    if (el.adminPasswordInput) el.adminPasswordInput.focus();
  }
}

// Load current state from localStorage
function loadLocalStorage() {
  const storedPrompts = localStorage.getItem("phoenix_prompts");
  if (storedPrompts) {
    prompts = JSON.parse(storedPrompts);
  } else {
    prompts = [...DEFAULT_PROMPTS];
    savePrompts();
  }
  
  // Sync Badge Counters
  const storedCart = localStorage.getItem("phoenix_cart");
  const cartList = storedCart ? JSON.parse(storedCart) : [];
  if (el.cartCount) el.cartCount.textContent = cartList.length;
  
  const storedWishlist = localStorage.getItem("phoenix_wishlist");
  const wishlistList = storedWishlist ? JSON.parse(storedWishlist) : [];
  if (el.wishlistCount) el.wishlistCount.textContent = wishlistList.length;
}

function savePrompts() {
  localStorage.setItem("phoenix_prompts", JSON.stringify(prompts));
}

// Render Table
function renderAll() {
  renderStats();
  if (!el.adminTableBody) return;
  
  let html = "";
  prompts.forEach((p) => {
    const isFree = p.price === 0;
    const imageSrc = p.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100';
    
    const featuredBadge = p.featured ? `<span class="status-indicator featured">&#9733; Featured</span>` : ``;
    const visibilityBadge = p.visibility === 'public' 
      ? `<span class="status-indicator public">&#9679; Public</span>` 
      : `<span class="status-indicator draft">&#9679; Draft</span>`;
      
    html += `
      <tr>
        <td>
          <div class="admin-prod-cell">
            <img class="admin-prod-thumb" src="${imageSrc}" alt="${p.title}">
            <div>
              <span class="admin-prod-title">${p.title}</span>
              <div style="font-size:0.75rem; color:var(--text-secondary);">ID: ${p.id}</div>
            </div>
          </div>
        </td>
        <td><span style="color:var(--text-secondary);">${p.category}</span></td>
        <td><strong>${isFree ? 'FREE' : '₹' + p.price}</strong></td>
        <td>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            ${visibilityBadge}
            ${featuredBadge}
          </div>
        </td>
        <td>
          <div class="admin-actions">
            <button class="btn-table-action edit" onclick="startEditPrompt('${p.id}')" title="Edit">&#9998;</button>
            <button class="btn-table-action delete" onclick="deletePrompt('${p.id}')" title="Delete">&times;</button>
          </div>
        </td>
      </tr>
    `;
  });
  
  el.adminTableBody.innerHTML = html;
}

// Update Hero Banner Stats
function renderStats() {
  if (el.statTotal) el.statTotal.textContent = prompts.length;
  if (el.statPublic) el.statPublic.textContent = prompts.filter(p => p.visibility === 'public').length;
  if (el.statFree) el.statFree.textContent = prompts.filter(p => p.price === 0).length;
  if (el.statFeatured) el.statFeatured.textContent = prompts.filter(p => p.featured).length;
}

// Event Listeners Setup
function setupEventListeners() {
  // Convert upload preview
  el.imageUpload?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      uploadedImageBase64 = event.target.result;
      el.imagePreview.src = uploadedImageBase64;
      el.imagePreview.style.display = "block";
      showToast("Preview image loaded.", "success");
    };
    reader.readAsDataURL(file);
  });
  
  // Submit Form
  el.adminForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const idValue = el.formPromptId.value;
    const title = el.formTitle.value.trim();
    const promptText = el.formPromptText.value.trim();
    const category = el.formCategory.value;
    const tagsText = el.formTags.value;
    const price = parseInt(el.formPrice.value) || 0;
    const visibility = el.formVisibility.value;
    const featured = el.formFeatured.checked;
    const seoDescription = el.formSeoDesc.value.trim();
    
    if (!title || !promptText || !category) {
      showToast("Please fill in all required fields.", "error");
      return;
    }
    
    const tags = tagsText.split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);
      
    let promptObj = {};
    
    if (idValue) {
      // EDIT MODE
      const existingIdx = prompts.findIndex(p => p.id === idValue);
      if (existingIdx === -1) return;
      
      const existing = prompts[existingIdx];
      
      promptObj = {
        ...existing,
        title,
        promptText,
        category,
        tags,
        price,
        visibility,
        featured,
        seoDescription,
        image: uploadedImageBase64 || existing.image
      };
      
      prompts[existingIdx] = promptObj;
      showToast(`Prompt "${title}" updated successfully!`, "success");
    } else {
      // NEW MODE
      const newId = "prompt_" + Date.now();
      promptObj = {
        id: newId,
        title,
        promptText,
        category,
        tags,
        price,
        visibility,
        featured,
        seoDescription,
        image: uploadedImageBase64 || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500", // Fallback gradient
        author: "Phoenix Admin",
        created: formatCurrentMonth(),
        rating: 5,
        ratingCount: 1
      };
      
      prompts.unshift(promptObj);
      showToast(`Prompt "${title}" uploaded successfully!`, "success");
    }
    
    resetAdminForm();
    savePrompts();
    renderAll();
  });
  
  // Cancel button resets the editing mode
  el.btnResetForm?.addEventListener("click", () => {
    resetAdminForm();
    showToast("Form cleared.", "info");
  });

  // Submit Login Form
  el.adminLoginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = el.adminPasswordInput.value;
    if (password === "admin123") {
      sessionStorage.setItem("phoenix_admin_auth", "true");
      checkAuth();
      showToast("Access Granted. Welcome, Admin!", "success");
    } else {
      showToast("Incorrect password. Please try again.", "error");
      el.adminPasswordInput.value = "";
      el.adminPasswordInput.focus();
    }
  });

  // Logout Admin Action
  el.btnLogout?.addEventListener("click", () => {
    sessionStorage.removeItem("phoenix_admin_auth");
    checkAuth();
    showToast("Logged out successfully.", "info");
  });
}

// Start Edit Mode
window.startEditPrompt = function(id) {
  const p = prompts.find(item => item.id === id);
  if (!p) return;
  
  el.formPromptId.value = p.id;
  el.formTitle.value = p.title;
  el.formPromptText.value = p.promptText;
  el.formCategory.value = p.category;
  el.formTags.value = p.tags.join(", ");
  el.formPrice.value = p.price;
  el.formVisibility.value = p.visibility;
  el.formFeatured.checked = p.featured;
  el.formSeoDesc.value = p.seoDescription;
  
  if (p.image) {
    el.imagePreview.src = p.image;
    el.imagePreview.style.display = "block";
    uploadedImageBase64 = p.image;
  } else {
    el.imagePreview.style.display = "none";
    uploadedImageBase64 = "";
  }
  
  el.formModeTitle.textContent = "Edit Prompt";
  el.formSubmitBtn.textContent = "Save Changes";
  el.formSubmitBtn.classList.remove("btn-primary");
  el.formSubmitBtn.classList.add("btn-gold");
  
  el.adminForm.scrollIntoView({ behavior: 'smooth' });
};

// Delete Prompt
window.deletePrompt = function(id) {
  if (!confirm("Are you sure you want to delete this prompt?")) return;
  
  prompts = prompts.filter(p => p.id !== id);
  savePrompts();
  renderAll();
  showToast("Prompt deleted from catalog.", "info");
};

// Reset Form fields
function resetAdminForm() {
  el.adminForm.reset();
  el.formPromptId.value = "";
  el.imagePreview.style.display = "none";
  uploadedImageBase64 = "";
  el.formModeTitle.textContent = "Upload Prompt";
  el.formSubmitBtn.textContent = "Upload Prompt";
  el.formSubmitBtn.classList.remove("btn-gold");
  el.formSubmitBtn.classList.add("btn-primary");
}

function formatCurrentMonth() {
  const date = new Date();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Toast Notifications
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
  
  setTimeout(() => {
    toast.classList.add("fade-out");
    toast.addEventListener("animationend", () => {
      toast.remove();
    });
  }, 4000);
}

// Run init
document.addEventListener("DOMContentLoaded", init);
