// === SIDEBAR DROPDOWN TOGGLE ===
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const content = document.getElementById(toggle.dataset.target);
    const arrow = toggle.querySelector('.arrow');
    const isOpen = content.style.display === 'flex';
    content.style.display = isOpen ? 'none' : 'flex';
    arrow.classList.toggle('rotate', !isOpen);
    arrow.classList.toggle('black', !isOpen);
  });
});

// === DATA ===
let liveOrders = [];
let historyOrders = [];
let preOrders = [];
let preOrderHistory = [];
let menuItems = [
  { name: "Veg Burger", price: "Rs.120", available: true, category: "Starter" },
  { name: "Paneer Pizza", price: "Rs.250", available: false, category: "Starter" },
  { name: "French Fries", price: "Rs.80", available: true, category: "Starter" },
  { name: "Cheese Sandwich", price: "Rs.150", available: true, category: "Main Course" },
  { name: "Cold Coffee", price: "Rs.90", available: false, category: "Juice" },
  { name: "Chicken Roll", price: "Rs.180", available: true, category: "Main Course" },
  { name: "Mango Shake", price: "Rs.110", available: true, category: "Juice" },
  { name: "Veg Biryani", price: "Rs.200", available: false, category: "Main Course" }
];


for (let i = 1; i <= 20; i++) {
  liveOrders.push({
    name: `Customer ${i}`,
    orderNo: `#${i}`,
    price: `Rs.${Math.floor(Math.random() * 500) + 100}`,
    items: ["1x Item A", "2x Item B", "1x Item C"]
  });
  preOrders.push({
    name: `Customer ${i}`,
    orderNo: `#${i}`,
    price: `Rs.${Math.floor(Math.random() * 500) + 100}`,
    items: ["1x Item A", "2x Item B", "1x Item C"]
  });
}

// === RENDER FUNCTIONS ===
function renderLiveOrders() {
  const html = liveOrders.map(order => `
    <div class="live-order-card">
      <div class="live-order-header">
        <span><strong>${order.name}</strong></span>
        <span><strong>Order ${order.orderNo}</strong></span>
        <span><strong>${order.price}</strong></span>
        <span class="btn-ready">MARK AS READY</span>
        <span class="btn-delivered live-delivered" data-order="${order.orderNo}">DELIVERED</span>
        <span class="dropdown-arrow">▼</span>
      </div>
      <div class="live-order-details" style="display: none;">
        ${order.items.join('<br>')}
      </div>
    </div>
  `).join('');
  contentBox.innerHTML = `<div class="live-orders-container">${html}</div>`;
  setupOrderDropdowns();
  setupDeliveredButtons('live');
}

function renderPreOrders() {
  const html = preOrders.map(order => `
    <div class="live-order-card">
      <div class="live-order-header">
        <span><strong>${order.name}</strong></span>
        <span><strong>Order ${order.orderNo}</strong></span>
        <span><strong>${order.price}</strong></span>
        <span class="btn-ready">MARK AS READY</span>
        <span class="btn-delivered pre-delivered" data-order="${order.orderNo}">DELIVERED</span>
        <span class="dropdown-arrow">▼</span>
      </div>
      <div class="live-order-details" style="display: none;">
        ${order.items.join('<br>')}
      </div>
    </div>
  `).join('');
  contentBox.innerHTML = `<div class="live-orders-container">${html}</div>`;
  setupOrderDropdowns();
  setupDeliveredButtons('pre');
}

function renderHistory() {
  const liveHtml = historyOrders.map(order => `
    <div class="live-order-card">
      <div class="live-order-header">
        <span><strong>${order.name}</strong></span>
        <span><strong>Order ${order.orderNo}</strong></span>
        <span><strong>${order.price}</strong></span>
      </div>
    </div>
  `).join('');
  const preHtml = preOrderHistory.map(order => `
    <div class="live-order-card">
      <div class="live-order-header">
        <span><strong>${order.name} (Pre-Order)</strong></span>
        <span><strong>Order ${order.orderNo}</strong></span>
        <span><strong>${order.price}</strong></span>
      </div>
    </div>
  `).join('');
  contentBox.innerHTML = `
    <div class="live-orders-container">
      <h3>Live Order History</h3>
      ${liveHtml || "<p>No live order history</p>"}
      <h3>Pre-Order History</h3>
      ${preHtml || "<p>No pre-order history</p>"}
    </div>
  `;
}

function renderContactPage() {
  contentBox.innerHTML = `
    <div class="contact-container" style="padding: 30px; text-align: center;">
      <h2 style="font-size: 32px;">Contact Us</h2>
      <p style="font-size: 18px; color: #555;">Have questions, feedback, or need assistance? Our team is here to help you!</p>
      <div style="display: inline-block; text-align: left; font-size: 18px; line-height: 1.6; color: #333;">
        <p><strong>Phone:</strong> +91 98765 43210</p>
        <p><strong>Email:</strong> support@example.com</p>
        <p><strong>Address:</strong> 123, Your Street, Your City, India</p>
      </div>
      <p style="margin-top: 20px; font-size: 16px; color: #666;">We’re available 24/7. Your satisfaction is our priority!</p>
    </div>
  `;
}

function renderMenuManagement() {
  contentBox.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <input type="text" id="menuSearch" placeholder="Search..." style="padding: 6px; border: 1px solid #ccc; border-radius: 4px;">
      <button id="addMenuBtn" style="padding: 6px 12px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">+ ADD</button>
    </div>
    <div id="menuCategories"></div>
  `;

  document.getElementById('addMenuBtn').addEventListener('click', openAddMenuModal);
  document.getElementById('menuSearch').addEventListener('input', (e) => {
    renderMenuCards(e.target.value.toLowerCase());
  });

  renderMenuCards('');
}

function renderMenuCards(searchTerm) {
  const grouped = { Starter: [], "Main Course": [], Juice: [] };
  menuItems.forEach((item, idx) => {
    if (!searchTerm || item.name.toLowerCase().includes(searchTerm)) {
      grouped[item.category || "Starter"].push({ ...item, index: idx });
    }
  });

  let html = '';
  Object.keys(grouped).forEach(category => {
    if (grouped[category].length) {
      html += `<h3 class="menu-category">${category}</h3>`;
      grouped[category].forEach(item => {
        html += `
          <div class="menu-card">
            <div class="menu-header">
              <span><strong>${item.name}</strong></span>
              <span><strong>${item.price}</strong></span>
              <div class="menu-actions">
                <button class="edit-btn" data-index="${item.index}">EDIT</button>
                <button class="availability-btn ${item.available ? 'available' : 'unavailable'}" data-index="${item.index}">
                  ${item.available ? 'AVAILABLE' : 'UNAVAILABLE'}
                </button>
              </div>
            </div>
          </div>
        `;
      });
    }
  });

  document.getElementById('menuCategories').innerHTML = html;

  // Setup handlers as before
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEditMenuModal(btn.dataset.index);
    });
  });

  document.querySelectorAll('.availability-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = btn.dataset.index;
      menuItems[index].available = !menuItems[index].available;
      renderMenuCards(searchTerm);
    });
  });
}





// === MODAL FUNCTIONS ===
function openAddMenuModal() {
  document.getElementById('modal-root').innerHTML = `
    <div id="menuModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 999;">
      <div style="background: white; padding: 30px; border-radius: 12px; width: 800px; display: grid; grid-template-columns: 1fr 2fr; gap: 30px; position: relative;">
        <button onclick="closeMenuModal()" style="position: absolute; top: 10px; right: 10px; background: #eee; color: #333; border: 1px solid #ccc; border-radius: 50%; width: 28px; height: 28px; font-size: 16px; font-weight: bold; cursor: pointer; line-height: 28px; text-align: center;">X</button>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
          <div style="border: 2px dashed #ccc; width: 150px; height: 150px; display: flex; justify-content: center; align-items: center; border-radius: 10px; cursor: pointer;">
            <input type="file" id="uploadImage" style="display: none;">
            <label for="uploadImage" style="cursor: pointer; font-size: 14px; color: #666;"><div style="font-size: 32px; color: #28a745;">+</div>upload image</label>
          </div>
          <input type="number" id="menuTime" placeholder="Time (Min.)" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ccc;">
          <input type="number" id="menuPrice" placeholder="Price" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ccc;">
        </div>
        <div>
          <label>Name</label>
          <input type="text" id="menuName" placeholder="Name" style="width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 6px; border: 1px solid #ccc;">
          <label>Description</label>
          <textarea id="menuDesc" placeholder="Description" style="width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 6px; border: 1px solid #ccc; height: 80px;"></textarea>
          <label>Category</label><br/>
          <label><input type="radio" name="category" value="Starter" checked> Starter</label>
          <label><input type="radio" name="category" value="Main Course"> Main Course</label>
          <label><input type="radio" name="category" value="Juice"> Juice</label>
          <div style="text-align: right; margin-top: 20px;">
            <button onclick="saveMenuItem()" style="background: #28a745; color: white; padding: 8px 18px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">Save</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function closeMenuModal() {
  document.getElementById('modal-root').innerHTML = '';
}

function saveMenuItem() {
  const name = document.getElementById('menuName').value;
  const price = "Rs." + document.getElementById('menuPrice').value;
  menuItems.push({ name, price, available: true });
  closeMenuModal();
  renderMenuManagement();
}

// === HELPERS ===
function setupOrderDropdowns() {
  document.querySelectorAll('.dropdown-arrow').forEach(arrow => {
    arrow.addEventListener('click', () => {
      const details = arrow.parentElement.nextElementSibling;
      const isVisible = details.style.display === 'block';
      details.style.display = isVisible ? 'none' : 'block';
      arrow.classList.toggle('open', !isVisible);
    });
  });
}

function setupDeliveredButtons(type) {
  const selector = type === 'live' ? '.live-delivered' : '.pre-delivered';
  document.querySelectorAll(selector).forEach(btn => {
    btn.addEventListener('click', () => {
      const orderNo = btn.dataset.order;
      const list = type === 'live' ? liveOrders : preOrders;
      const history = type === 'live' ? historyOrders : preOrderHistory;
      const index = list.findIndex(o => o.orderNo === orderNo);
      if (index !== -1) {
        history.push(list[index]);
        list.splice(index, 1);
        type === 'live' ? renderLiveOrders() : renderPreOrders();
      }
    });
  });
}

// === NAV CLICK HANDLER ===
const icons = {
  home: 'icons/home-black.svg',
  liveOrder: 'icons/order-black.svg',
  preOrder: 'icons/order-black.svg',
  history: 'icons/order-black.svg',
  preManage: 'icons/manage-black.svg',
  menu: 'icons/manage-black.svg',
  delivery: 'icons/manage-black.svg',
  contact: 'icons/contact-black.svg'
};

const contentBox = document.getElementById('content-box');
const pageTitle = document.getElementById('page-title');
const iconBox = document.getElementById('heading-icon');

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const page = item.dataset.page;
    if (page === 'liveOrder') renderLiveOrders();
    else if (page === 'preOrder') renderPreOrders();
    else if (page === 'history') renderHistory();
    else if (page === 'menu') renderMenuManagement();
    else if (page === 'contact') renderContactPage();
    else contentBox.innerHTML = `<h2>${item.textContent.trim()} Page</h2>`;

    pageTitle.textContent = (page === 'preManage' || page === 'menu' || page === 'delivery') ? `${item.textContent.trim()} Management` : item.textContent.trim();
    if (icons[page]) iconBox.style.backgroundImage = `url('${icons[page]}')`;
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    if (page === 'home' || page === 'contact') {
      contentBox.style.background = '#fff';
      contentBox.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    } else {
      contentBox.style.background = 'none';
      contentBox.style.boxShadow = 'none';
    }
  });
});

// === Accessibility key handlers ===
document.querySelectorAll('.dropdown-toggle, .nav-item').forEach(el => {
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      el.click();
    }
  });
});
