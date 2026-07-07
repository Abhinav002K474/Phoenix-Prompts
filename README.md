# 🔥 Phoenix Prompts
### *Premium AI Prompts Marketplace for Creators*

Phoenix Prompts is a modern, high-end, responsive single-page web application designed for creators to discover, wishlist, and unlock state-of-the-art generative AI art prompts (Midjourney, Stable Diffusion, ChatGPT). 

It features a premium dark-luxury aesthetic, interactive micro-animations, copy/selection security gates, and a completely separate admin panel for catalog management.

---

## 🌟 Key Features

### 🎨 Storefront & Catalog (`index.html`)
- **Premium Design Aesthetics**: Rich dark mode styling paired with luxury gold and purple accents, glassmorphic headers, and custom typography (`Orbitron`, `Sora`, `Inter`).
- **Live Search & Filters**: Instant keyboard search, category checkboxes, price range toggles (All/Free/Premium), tag cloud filtering, and rating sorting.
- **Wishlist & Shopping Cart**: Slide-out drawers to save items or purchase them together.
- **Simulated Payment Gateway**: Lock and unlock prompts instantly with a simulated checkout sequence.
- **Protected Previews**: Unlocked prompts enable copy/selection. Locked cards feature a watermarked canvas overlay, disabled text selection, and right-click protection to safeguard intellectual property.

### ⚙️ Standalone Admin Dashboard (`admin.html`)
- **Gated Access**: A secure login panel hides administrative controls. Normal users browsing the store cannot see or navigate to the admin page.
- **Default Login Password**: `admin123`
- **Catalog CRUD Forms**: Add new prompts (including title, tags, description, price, featured flag) and convert output previews into Base64 strings automatically.
- **Synchronized Catalog**: Full CRUD (Create, Read, Update, Delete) capability. Actions automatically write to browser `LocalStorage`, ensuring modifications instantly display on the Browse page.
- **Live Stats Hero**: Displays real-time metrics for Total, Public, Free, and Featured prompts in your library.
- **Session Management**: Session auto-expires when the browser tab closes, or when using the navbar "Log Out" (🚪) action button.

---

## 🛠️ Technology Stack
- **Structure**: Semantic HTML5
- **Styling**: Modern external CSS3 (variables, CSS Grid, Flexbox, custom media queries)
- **Logic**: Vanilla ES6 JavaScript (LocalStorage state engine)
- **Icons/Visuals**: Unicode glyph representations & CSS-rendered graphics for high performance

---

## 🚀 How to Run Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Abhinav002K474/Phoenix-Prompts.git
   cd Phoenix-Prompts
   ```

2. **Start a Local Server**:
   Because the project loads external media assets and relies on module scripts/LocalStorage, run it through a local HTTP server:
   - **Python**:
     ```bash
     python -m http.server 8000
     ```
   - **Node.js (http-server)**:
     ```bash
     npx http-server -p 8000
     ```

3. **Open the App**:
   - Storefront: `http://localhost:8000/`
   - Admin Panel: `http://localhost:8000/admin.html` (Password: `admin123`)
