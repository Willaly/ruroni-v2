/* =========================================================
   BOUTIQUE — Simulation Shopify Buy Button
   ---------------------------------------------------------
   En production, chaque .product-card sera remplacé par un widget
   Shopify Buy Button via le Shopify JS SDK :
     https://shopify.dev/docs/api/storefront/buy-button

   Le code ci-dessous simule le flux UX exact (ajout panier, drawer,
   total, checkout) pour valider le design AVANT branchement Shopify.
   ========================================================= */

const PRODUCTS = [
  { id: 'tshirt-ruroni', name: 'T-shirt Ruroni Classic', cat: 'Apparel', price: 28, tag: null, variants: ['XS','S','M','L','XL','XXL'], img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80' },
  { id: 'tshirt-athlete', name: 'T-shirt "Athlete"', cat: 'Apparel', price: 32, tag: 'NEW', variants: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80' },
  { id: 'hoodie-samurai', name: 'Hoodie Samouraï', cat: 'Apparel', price: 65, tag: null, variants: ['S','M','L','XL','XXL'], img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80' },
  { id: 'crewneck-yay', name: 'Crewneck "You Against You"', cat: 'Apparel', price: 55, tag: null, variants: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80' },
  { id: 'tank-ronin', name: 'Débardeur Ronin', cat: 'Apparel', price: 28, tag: null, variants: ['XS','S','M','L','XL'], img: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=600&q=80' },
  { id: 'short-wod', name: 'Short de WOD', cat: 'Apparel', price: 38, tag: null, variants: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=80' },
  { id: 'gourde-inox', name: 'Gourde inox 750ml', cat: 'Accessoires', price: 22, tag: 'NEW', variants: ['Noir','Crème'], img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80' },
  { id: 'sac-sport', name: 'Sac de sport Ruroni', cat: 'Accessoires', price: 45, tag: null, variants: ['40L'], img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80' },
  { id: 'casquette', name: 'Casquette brodée', cat: 'Accessoires', price: 25, tag: null, variants: ['Taille unique'], img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80' },
  { id: 'sticker-pack', name: 'Pack Stickers + Lanyard', cat: 'Accessoires', price: 10, tag: 'SALE', priceOld: 14, variants: ['Pack'], img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80' },
];

const CATEGORIES = ['Tout', ...new Set(PRODUCTS.map(p => p.cat))];
const cart = new Map(); // id → { product, qty }
let activeCategory = 'Tout';

// ============ RENDU CATALOGUE ============
function renderFilter() {
  const wrap = document.getElementById('shop-filter');
  if (!wrap) return;
  wrap.innerHTML = CATEGORIES.map(c =>
    `<button data-cat="${c}" class="${c === activeCategory ? 'active' : ''}">${c}</button>`
  ).join('');
  wrap.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => {
      activeCategory = b.dataset.cat;
      renderFilter();
      renderProducts();
    });
  });
}

function renderProducts() {
  const wrap = document.getElementById('shop-products');
  if (!wrap) return;
  const filtered = activeCategory === 'Tout' ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeCategory);
  wrap.innerHTML = filtered.map(p => {
    const oldPrice = p.priceOld ? `<span class="old">${p.priceOld}€</span>` : '';
    const tag = p.tag ? `<span class="product-card__tag product-card__tag--${p.tag.toLowerCase()}">${p.tag}</span>` : '';
    const inCart = cart.has(p.id);
    return `
      <article class="product-card" data-id="${p.id}">
        <div class="product-card__img" style="background-image:url('${p.img}')">
          ${tag}
          <span class="shopify-note">Shopify product</span>
        </div>
        <div class="product-card__body">
          <span class="product-card__category">${p.cat}</span>
          <h3 class="product-card__name">${p.name}</h3>
          <div class="product-card__price">${oldPrice}${p.price}€</div>
          <div class="product-card__variants">${p.variants.map(v => `<span>${v}</span>`).join('')}</div>
          <button class="product-card__btn ${inCart ? 'is-added' : ''}" data-add="${p.id}">
            <span class="add">+ Ajouter au panier</span>
            <span class="added">✓ Ajouté</span>
          </button>
        </div>
      </article>
    `;
  }).join('');

  wrap.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn.dataset.add));
  });
}

// ============ PANIER ============
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const existing = cart.get(id);
  if (existing) existing.qty += 1;
  else cart.set(id, { product, qty: 1 });
  updateCartUI();
  // Feedback bouton produit
  const btn = document.querySelector(`[data-add="${id}"]`);
  if (btn) {
    btn.classList.add('is-added');
    setTimeout(() => openCart(), 200);
  }
}

function removeFromCart(id) {
  cart.delete(id);
  updateCartUI();
  renderProducts(); // reset bouton ajouter
}

function changeQty(id, delta) {
  const item = cart.get(id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart.delete(id);
    renderProducts();
  }
  updateCartUI();
}

function updateCartUI() {
  const totalItems = [...cart.values()].reduce((s, i) => s + i.qty, 0);
  const totalPrice = [...cart.values()].reduce((s, i) => s + i.product.price * i.qty, 0);

  // Badge fab
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = totalItems;
    badge.classList.toggle('show', totalItems > 0);
  }

  // Drawer items
  const items = document.getElementById('cart-items');
  if (items) {
    if (cart.size === 0) {
      items.innerHTML = `
        <div class="cart-drawer__empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
          <p>Ton panier est vide.</p>
          <p style="font-size:0.85rem;margin-top:0.5rem;">Ajoute du merch Ronin pour commencer.</p>
        </div>`;
    } else {
      items.innerHTML = [...cart.values()].map(({ product, qty }) => `
        <div class="cart-item">
          <div class="cart-item__img" style="background-image:url('${product.img}')"></div>
          <div>
            <div class="cart-item__name">${product.name}</div>
            <div class="cart-item__variant">${product.variants[0]}</div>
            <div class="cart-item__qty">
              <button data-qty="-" data-id="${product.id}" aria-label="Réduire">−</button>
              <span>${qty}</span>
              <button data-qty="+" data-id="${product.id}" aria-label="Augmenter">+</button>
            </div>
            <button class="cart-item__remove" data-remove="${product.id}">Retirer</button>
          </div>
          <div class="cart-item__price">${(product.price * qty).toFixed(0)}€</div>
        </div>
      `).join('');
    }
    items.querySelectorAll('[data-qty]').forEach(b => {
      b.addEventListener('click', () => changeQty(b.dataset.id, b.dataset.qty === '+' ? 1 : -1));
    });
    items.querySelectorAll('[data-remove]').forEach(b => {
      b.addEventListener('click', () => removeFromCart(b.dataset.remove));
    });
  }

  // Totals
  const subtotal = document.getElementById('cart-subtotal');
  const total = document.getElementById('cart-total');
  if (subtotal) subtotal.textContent = `${totalPrice.toFixed(0)}€`;
  if (total) total.textContent = `${totalPrice.toFixed(0)}€`;

  // Checkout button state
  const checkout = document.getElementById('cart-checkout');
  if (checkout) checkout.disabled = cart.size === 0;
}

function openCart() {
  document.getElementById('cart-drawer')?.classList.add('open');
  document.getElementById('cart-backdrop')?.classList.add('show');
  document.body.classList.add('modal-open');
}
function closeCart() {
  document.getElementById('cart-drawer')?.classList.remove('open');
  document.getElementById('cart-backdrop')?.classList.remove('show');
  document.body.classList.remove('modal-open');
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  renderFilter();
  renderProducts();
  updateCartUI();

  document.getElementById('cart-fab')?.addEventListener('click', openCart);
  document.getElementById('cart-close')?.addEventListener('click', closeCart);
  document.getElementById('cart-backdrop')?.addEventListener('click', closeCart);

  document.getElementById('cart-checkout')?.addEventListener('click', () => {
    const cfg = window.RURONI_CONFIG || {};
    const shopifyReady = cfg.shopify && cfg.shopify.storefrontAccessToken && !cfg.shopify.storefrontAccessToken.includes('REPLACE');
    if (shopifyReady) {
      // En prod : redirection vers checkout Shopify
      alert("Redirection vers le checkout Shopify (à brancher avec le SDK Shopify).");
    } else {
      alert("🛒 DÉMO\n\nEn production, ce bouton redirigera vers le checkout Shopify sécurisé (Apple Pay, CB, Klarna, etc.).\n\nÀ brancher : renseigne ton storefrontAccessToken dans js/config.js.");
    }
  });
});
