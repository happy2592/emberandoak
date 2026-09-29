/**
 * EMBER & OAK BISTRO - Interactive Restaurant Engine
 * Handles interactive menu filtering, cart/order placement, and counter bill generation.
 */

// -----------------------------------------------------------------------------
// Menu Catalog Data
// -----------------------------------------------------------------------------
const MENU_ITEMS = [
  {
    id: 'dish-1',
    name: 'Wood-Fired Prime Ribeye',
    category: 'mains',
    price: 34.50,
    desc: 'Prime aged beef with melting garlic-herb butter, roasted rosemary baby potatoes, and grilled asparagus.',
    image: 'assets/images/restaurant-hero.jpg',
    tags: ['Chef Special', 'Gluten Free'],
    isSpecial: true,
    isVeg: false
  },
  {
    id: 'dish-2',
    name: 'Wild Forest Truffle Tagliatelle',
    category: 'pasta',
    price: 22.00,
    desc: 'Handmade fresh egg pasta, wild chanterelle mushrooms, black truffle emulsion, 24-month aged Parmigiano.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d628120e?auto=format&fit=crop&w=700&q=80',
    tags: ['Vegetarian', 'Chef Special'],
    isSpecial: true,
    isVeg: true
  },
  {
    id: 'dish-3',
    name: 'Smoked Burrata & Heirloom Peach',
    category: 'starters',
    price: 16.00,
    desc: 'Artisan burrata, blistered heirloom peaches, aged balsamic reduction, toasted pistachios, and warm sourdough.',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=700&q=80',
    tags: ['Vegetarian'],
    isSpecial: false,
    isVeg: true
  },
  {
    id: 'dish-4',
    name: 'Hearth-Baked Margherita Pizza',
    category: 'pasta',
    price: 18.50,
    desc: 'Slow-fermented sourdough crust, San Marzano tomato coulis, buffalo mozzarella, fresh basil, extra virgin olive oil.',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=700&q=80',
    tags: ['Vegetarian'],
    isSpecial: false,
    isVeg: true
  },
  {
    id: 'dish-5',
    name: 'Pan-Seared Chilean Sea Bass',
    category: 'mains',
    price: 32.00,
    desc: 'Crispy skin sea bass resting on saffron fennel broth, buttered leeks, and roasted cherry vine tomatoes.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=80',
    tags: ['Chef Special', 'Gluten Free'],
    isSpecial: true,
    isVeg: false
  },
  {
    id: 'dish-6',
    name: 'Charred Spanish Octopus',
    category: 'starters',
    price: 19.50,
    desc: 'Tender tenderized octopus tentacle, smoked paprika potato crema, pickled shallots, celery leaf oil.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80',
    tags: ['Gluten Free'],
    isSpecial: false,
    isVeg: false
  },
  {
    id: 'dish-7',
    name: 'Dark Chocolate Lava Soufflé',
    category: 'desserts',
    price: 12.50,
    desc: 'Warm Valrhona 72% molten chocolate center, Madagascar vanilla bean gelato, candied hazelnut crunch.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80',
    tags: ['Vegetarian'],
    isSpecial: false,
    isVeg: true
  },
  {
    id: 'dish-8',
    name: 'Ember Smoked Old Fashioned',
    category: 'drinks',
    price: 14.00,
    desc: 'Bourbon infused with toasted oak, aromatic bitters, charred orange peel, presented under a dome of applewood smoke.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=700&q=80',
    tags: ['House Signature'],
    isSpecial: true,
    isVeg: true
  },
  {
    id: 'dish-9',
    name: 'Wild Berry Citrus Spritz (Mocktail)',
    category: 'drinks',
    price: 9.00,
    desc: 'Fresh muddled blackberries, fresh lime, botanical rosemary syrup, topped with sparkling elderflower tonic.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=700&q=80',
    tags: ['Vegetarian', 'Zero Proof'],
    isSpecial: false,
    isVeg: true
  }
];

// -----------------------------------------------------------------------------
// App State
// -----------------------------------------------------------------------------
let cart = {}; // { 'dish-1': 2, 'dish-2': 1 }
let currentCategory = 'all';
let currentDietary = 'all';
let currentSearch = '';
let currentOrderType = 'dine-in'; // 'dine-in' or 'takeaway'

// -----------------------------------------------------------------------------
// Initialization
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initMenuRenderer();
  initOrderDrawer();
  initBillModal();
  initFAQ();
});

/* --------------------------------------------------------------------------
   Sticky Navbar
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   Mobile Navigation
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    toggleBtn.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });
}

/* --------------------------------------------------------------------------
   Menu Rendering & Filtering
   -------------------------------------------------------------------------- */
function initMenuRenderer() {
  const menuContainer = document.getElementById('menuGrid');
  if (!menuContainer) return; // If on about page

  renderMenu();

  // Category Tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      renderMenu();
    });
  });

  // Search Input
  const searchInput = document.getElementById('menuSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      renderMenu();
    });
  }

  // Dietary Dropdown Filter
  const dietaryFilter = document.getElementById('dietaryFilter');
  if (dietaryFilter) {
    dietaryFilter.addEventListener('change', (e) => {
      currentDietary = e.target.value;
      renderMenu();
    });
  }
}

function renderMenu() {
  const menuContainer = document.getElementById('menuGrid');
  if (!menuContainer) return;

  const filteredItems = MENU_ITEMS.filter(item => {
    // Category match
    const categoryMatch = currentCategory === 'all' || item.category === currentCategory;
    
    // Search match
    const searchMatch = !currentSearch || 
      item.name.toLowerCase().includes(currentSearch) || 
      item.desc.toLowerCase().includes(currentSearch);

    // Dietary match
    let dietaryMatch = true;
    if (currentDietary === 'veg') {
      dietaryMatch = item.isVeg === true;
    } else if (currentDietary === 'special') {
      dietaryMatch = item.isSpecial === true;
    }

    return categoryMatch && searchMatch && dietaryMatch;
  });

  if (filteredItems.length === 0) {
    menuContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <p style="font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--text-primary);">No dishes found</p>
        <p>Try searching for a different item or resetting the filter category.</p>
      </div>
    `;
    return;
  }

  menuContainer.innerHTML = filteredItems.map(item => {
    const qty = cart[item.id] || 0;
    const isVegetarian = item.isVeg ? `<span class="badge-veg">Vegetarian</span>` : '';
    const isSpecial = item.isSpecial ? `<span class="badge-special">Chef Recommended</span>` : '';

    const actionButton = qty > 0 
      ? `
        <div class="qty-stepper">
          <button class="stepper-btn" onclick="updateItemQuantity('${item.id}', -1)" aria-label="Decrease quantity">−</button>
          <span class="stepper-val">${qty} in Order</span>
          <button class="stepper-btn" onclick="updateItemQuantity('${item.id}', 1)" aria-label="Increase quantity">+</button>
        </div>
      `
      : `
        <button class="add-to-cart-btn" onclick="updateItemQuantity('${item.id}', 1)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add to Order
        </button>
      `;

    return `
      <div class="menu-card" id="card-${item.id}">
        <div class="menu-img-wrap">
          <img src="${item.image}" alt="${item.name}" class="menu-card-img" loading="lazy">
          ${isVegetarian}
          ${isSpecial}
        </div>
        <div class="menu-card-body">
          <div class="menu-item-header">
            <h3 class="menu-item-name">${item.name}</h3>
            <span class="menu-item-price">$${item.price.toFixed(2)}</span>
          </div>
          <p class="menu-item-desc">${item.desc}</p>
          <div class="menu-item-footer">
            ${actionButton}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* --------------------------------------------------------------------------
   Cart & Order Management
   -------------------------------------------------------------------------- */
window.updateItemQuantity = function(itemId, change) {
  const currentQty = cart[itemId] || 0;
  const newQty = Math.max(0, currentQty + change);

  if (newQty === 0) {
    delete cart[itemId];
  } else {
    cart[itemId] = newQty;
  }

  // Update UI components
  renderMenu();
  updateCartCounters();
  renderDrawerItems();

  const item = MENU_ITEMS.find(i => i.id === itemId);
  if (change > 0 && item) {
    showToast(`Added ${item.name} to your order tray`);
  }
};

function updateCartCounters() {
  const totalItems = Object.values(cart).reduce((sum, q) => sum + q, 0);
  const totalAmount = calculateSubtotal();

  // Header Cart Badge
  const headerCountEl = document.getElementById('headerCartCount');
  if (headerCountEl) headerCountEl.textContent = totalItems;

  // Floating Order Bar
  const floatingBar = document.getElementById('floatingOrderBar');
  const floatingCountEl = document.getElementById('floatingCartCount');
  const floatingTotalEl = document.getElementById('floatingCartTotal');

  if (floatingBar) {
    if (totalItems > 0) {
      floatingBar.classList.add('visible');
      if (floatingCountEl) floatingCountEl.textContent = totalItems;
      if (floatingTotalEl) floatingTotalEl.textContent = `$${totalAmount.toFixed(2)}`;
    } else {
      floatingBar.classList.remove('visible');
    }
  }
}

function calculateSubtotal() {
  return Object.entries(cart).reduce((total, [itemId, qty]) => {
    const item = MENU_ITEMS.find(i => i.id === itemId);
    return total + (item ? item.price * qty : 0);
  }, 0);
}

/* --------------------------------------------------------------------------
   Slide-Over Order Drawer
   -------------------------------------------------------------------------- */
function initOrderDrawer() {
  const drawerOverlay = document.getElementById('orderDrawerOverlay');
  const openButtons = document.querySelectorAll('[data-open-drawer="order"]');
  const closeBtn = document.getElementById('drawerCloseBtn');

  if (!drawerOverlay) return;

  const openDrawer = () => {
    renderDrawerItems();
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawerOverlay.addEventListener('click', (e) => {
    if (e.target === drawerOverlay) closeDrawer();
  });

  // Order Type Toggle (Dine In vs Takeaway)
  const typeButtons = document.querySelectorAll('.order-type-btn');
  const tableInputGroup = document.getElementById('tableInputGroup');

  typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      typeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentOrderType = btn.getAttribute('data-order-type');

      if (tableInputGroup) {
        if (currentOrderType === 'dine-in') {
          tableInputGroup.style.display = 'block';
        } else {
          tableInputGroup.style.display = 'none';
        }
      }
    });
  });

  // Submit Order & Generate Counter Bill
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
      const totalItems = Object.values(cart).reduce((sum, q) => sum + q, 0);
      if (totalItems === 0) {
        showToast('Your order tray is currently empty. Please select dishes from the menu.');
        return;
      }

      // Check Table Number if Dine-in
      const tableInput = document.getElementById('tableNumberInput');
      const customerNameInput = document.getElementById('customerNameInput');

      if (currentOrderType === 'dine-in' && (!tableInput || !tableInput.value.trim())) {
        showToast('Please specify your Table Number for Dine-In service.');
        if (tableInput) tableInput.focus();
        return;
      }

      closeDrawer();
      generateAndShowCounterBill();
    });
  }
}

function renderDrawerItems() {
  const container = document.getElementById('drawerCartItems');
  const subtotalEl = document.getElementById('drawerSubtotal');
  const taxEl = document.getElementById('drawerTax');
  const grandTotalEl = document.getElementById('drawerGrandTotal');
  const placeOrderBtn = document.getElementById('placeOrderBtn');

  if (!container) return;

  const entries = Object.entries(cart);

  if (entries.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-state">
        <div class="empty-cart-icon">🍽️</div>
        <p style="font-weight: 600; color: white; margin-bottom: 0.35rem;">Your order tray is empty</p>
        <p style="font-size: 0.85rem;">Browse our kitchen selections and tap "Add to Order" to begin.</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '$0.00';
    if (taxEl) taxEl.textContent = '$0.00';
    if (grandTotalEl) grandTotalEl.textContent = '$0.00';
    if (placeOrderBtn) placeOrderBtn.disabled = true;
    return;
  }

  if (placeOrderBtn) placeOrderBtn.disabled = false;

  container.innerHTML = entries.map(([itemId, qty]) => {
    const item = MENU_ITEMS.find(i => i.id === itemId);
    if (!item) return '';
    const lineTotal = item.price * qty;

    return `
      <div class="cart-item-row">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-unitprice">$${item.price.toFixed(2)} each</div>
        </div>
        <div class="cart-item-controls">
          <button class="cart-mini-btn" onclick="updateItemQuantity('${item.id}', -1)" aria-label="Decrease quantity">−</button>
          <span style="font-weight: 700; color: white; min-width: 20px; text-align: center;">${qty}</span>
          <button class="cart-mini-btn" onclick="updateItemQuantity('${item.id}', 1)" aria-label="Increase quantity">+</button>
        </div>
        <div class="cart-item-total">$${lineTotal.toFixed(2)}</div>
      </div>
    `;
  }).join('');

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.05; // 5% restaurant service & local tax
  const grandTotal = subtotal + tax;

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
  if (grandTotalEl) grandTotalEl.textContent = `$${grandTotal.toFixed(2)}`;
}

/* --------------------------------------------------------------------------
   Counter Bill Modal Generation (No Online Payment)
   -------------------------------------------------------------------------- */
function initBillModal() {
  const billOverlay = document.getElementById('billModalOverlay');
  const printBtn = document.getElementById('printBillBtn');
  const newOrderBtn = document.getElementById('newOrderBtn');

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (newOrderBtn) {
    newOrderBtn.addEventListener('click', () => {
      cart = {};
      updateCartCounters();
      renderMenu();
      if (billOverlay) billOverlay.classList.remove('active');
      document.body.style.overflow = '';
      showToast('Order complete. Ready for a new order!');
    });
  }

  if (billOverlay) {
    billOverlay.addEventListener('click', (e) => {
      if (e.target === billOverlay) {
        billOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

function generateAndShowCounterBill() {
  const billOverlay = document.getElementById('billModalOverlay');
  if (!billOverlay) return;

  const tableInput = document.getElementById('tableNumberInput');
  const customerNameInput = document.getElementById('customerNameInput');
  const specialNotesInput = document.getElementById('specialNotesInput');

  const orderNum = 'EO-' + Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const timeString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const customerName = (customerNameInput && customerNameInput.value.trim()) || 'Guest';
  const tableVal = (tableInput && tableInput.value.trim()) || 'Counter';
  const serviceTypeLabel = currentOrderType === 'dine-in' ? `Dine-In (Table #${tableVal})` : 'Takeaway / Pickup';

  // Populate Meta
  const orderIdEl = document.getElementById('billOrderId');
  const orderTimeEl = document.getElementById('billOrderTime');
  const orderTypeEl = document.getElementById('billOrderType');
  const orderCustomerEl = document.getElementById('billCustomerName');

  if (orderIdEl) orderIdEl.textContent = `#${orderNum}`;
  if (orderTimeEl) orderTimeEl.textContent = timeString;
  if (orderTypeEl) orderTypeEl.textContent = serviceTypeLabel;
  if (orderCustomerEl) orderCustomerEl.textContent = customerName;

  // Populate Table Items
  const tableBody = document.getElementById('billTableBody');
  if (tableBody) {
    tableBody.innerHTML = Object.entries(cart).map(([itemId, qty]) => {
      const item = MENU_ITEMS.find(i => i.id === itemId);
      if (!item) return '';
      const lineTotal = item.price * qty;
      return `
        <tr>
          <td>
            <strong>${item.name}</strong>
            <div style="font-size: 0.775rem; color: #64748b;">$${item.price.toFixed(2)} × ${qty}</div>
          </td>
          <td>${qty}</td>
          <td>$${lineTotal.toFixed(2)}</td>
        </tr>
      `;
    }).join('');
  }

  // Populate Totals
  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax;

  const subtotalEl = document.getElementById('billSubtotal');
  const taxEl = document.getElementById('billTax');
  const totalDueEl = document.getElementById('billTotalDue');

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
  if (totalDueEl) totalDueEl.textContent = `$${grandTotal.toFixed(2)}`;

  // Open modal
  billOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  showToast(`Order #${orderNum} created! Please present bill at counter.`);
}

/* --------------------------------------------------------------------------
   FAQ Accordion (About Page)
   -------------------------------------------------------------------------- */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const button = item.querySelector('.faq-question');
    if (!button) return;

    button.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isActive) {
        item.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Toast Feedback System
   -------------------------------------------------------------------------- */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 400);
  }, 4000);
}
