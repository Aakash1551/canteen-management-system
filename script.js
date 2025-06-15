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
let menuItems = [];

const storedMenu = localStorage.getItem('menuItems');
if (storedMenu) {
  menuItems = JSON.parse(storedMenu);
} else {
  menuItems = [
    { name: "Veg Burger", price: "Rs.120", available: true, category: "Starter", description: "Delicious veg patty burger", time: 10 },
    { name: "Paneer Pizza", price: "Rs.250", available: false, category: "Starter", description: "Cheesy paneer pizza", time: 15 },
    { name: "French Fries", price: "Rs.80", available: true, category: "Starter", description: "Crispy golden fries", time: 8 },
    { name: "Cheese Sandwich", price: "Rs.150", available: true, category: "Main Course", description: "Grilled cheese sandwich", time: 12 },
    { name: "Cold Coffee", price: "Rs.90", available: false, category: "Juice", description: "Chilled coffee delight", time: 5 },
    { name: "Chicken Roll", price: "Rs.180", available: true, category: "Main Course", description: "Spicy chicken roll", time: 14 },
    { name: "Mango Shake", price: "Rs.110", available: true, category: "Juice", description: "Fresh mango shake", time: 6 },
    { name: "Veg Biryani", price: "Rs.200", available: false, category: "Main Course", description: "Aromatic veg biryani", time: 20 }
  ];
}

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

// === RENDER LIVE ORDERS ===
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

// === RENDER PRE ORDERS ===
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

// === RENDER HISTORY ===
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

// === RENDER CONTACT PAGE ===
function renderContactPage() {
  contentBox.innerHTML = `
    <div class="contact-container" style="padding: 30px; text-align: center;">
      <h2 style="font-size: 32px;">Contact Us</h2>
      <p style="font-size: 18px; color: #555;">
        Have questions, feedback, or need assistance? Our team is here to help you!
      </p>
      <div style="display: inline-block; text-align: left; font-size: 18px; line-height: 1.6; color: #333;">
        <p><strong>Phone:</strong> +91 98765 43210</p>
        <p><strong>Email:</strong> support@example.com</p>
        <p><strong>Address:</strong> 123, Your Street, Your City, India</p>
      </div>
      <p style="margin-top: 20px; font-size: 16px; color: #666;">
        We’re available 24/7. Your satisfaction is our priority!
      </p>
    </div>
  `;
}

// === RENDER MENU MANAGEMENT ===
function renderMenuManagement() {
  contentBox.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <input type="text" id="menuSearch" placeholder="Search..." style="padding: 6px; border: 1px solid #ccc; border-radius: 4px;">
      <select id="sortMenu" style="padding: 6px; border: 1px solid #ccc; border-radius: 4px; margin-right: 10px;">
        <option value="">Sort</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="timeAsc">Time: Low to High</option>
        <option value="timeDesc">Time: High to Low</option>
      </select>
      <button id="addMenuBtn" style="padding: 6px 12px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">+ ADD</button>
    </div>
    <div id="menuCategories"></div>
  `;

  document.getElementById('addMenuBtn').addEventListener('click', openAddMenuModal);
  document.getElementById('menuSearch').addEventListener('input', (e) => {
    renderMenuCards(e.target.value.toLowerCase());
  });

  document.getElementById('sortMenu').addEventListener('change', () => {
    const searchValue = document.getElementById('menuSearch').value.toLowerCase();
    renderMenuCards(searchValue);
  });

  renderMenuCards('');
}

// === RENDER MENU CARDS ===
function renderMenuCards(searchTerm) {
  const sortValue = document.getElementById('sortMenu')?.value;

  let filteredItems = menuItems.filter(item => {
    return (
      !searchTerm ||
      item.name.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm)
    );
  });

  if (sortValue === 'priceAsc') {
    filteredItems.sort((a, b) => parseInt(a.price.replace('Rs.', '')) - parseInt(b.price.replace('Rs.', '')));
  } else if (sortValue === 'priceDesc') {
    filteredItems.sort((a, b) => parseInt(b.price.replace('Rs.', '')) - parseInt(a.price.replace('Rs.', '')));
  } else if (sortValue === 'timeAsc') {
    filteredItems.sort((a, b) => (a.time || 0) - (b.time || 0));
  } else if (sortValue === 'timeDesc') {
    filteredItems.sort((a, b) => (b.time || 0) - (a.time || 0));
  }

  const grouped = { Starter: [], "Main Course": [], Juice: [] };
  filteredItems.forEach((item, idx) => {
    if (grouped[item.category]) {
      grouped[item.category].push({ ...item, index: idx });
    } else {
      grouped["Starter"].push({ ...item, index: idx });
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
              <span>
                <span style="width:10px; height:10px; border-radius:50%; display:inline-block; margin-right:5px; background:${item.available ? 'green' : 'red'};"></span>
                <strong>${item.name}</strong>
              </span>
              <span><strong>${item.price}</strong></span>
              <div class="menu-actions">
                <button class="edit-btn" data-index="${item.index}">EDIT</button>
                <button class="availability-btn ${item.available ? 'available' : 'unavailable'}" data-index="${item.index}">
                  ${item.available ? 'AVAILABLE' : 'UNAVAILABLE'}
                </button>
                <button class="delete-btn" data-index="${item.index}" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">DELETE</button>
                <span class="dropdown-arrow">▼</span>
              </div>
            </div>
            <div class="live-order-details" style="display: none; width: 100%; padding: 10px 0 0 0;">
              <div style="font-size: 14px; color: #444; padding-left: 10px;">
                <p><strong>Description:</strong> ${item.description || "N/A"}</p>
                <p><strong>Category:</strong> ${item.category}</p>
                <p><strong>Time to prepare:</strong> ${item.time || "N/A"} min</p>
              </div>
            </div>
          </div>
        `;
      });
    }
  });

  document.getElementById('menuCategories').innerHTML = html;

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
      saveMenuToStorage();
      renderMenuCards(searchTerm);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = btn.dataset.index;
      showDeleteConfirm(index, searchTerm);
    });
  });

  document.querySelectorAll('.dropdown-arrow').forEach(arrow => {
    arrow.addEventListener('click', () => {
      const details = arrow.closest('.menu-card').querySelector('.live-order-details');
      const isVisible = details.style.display === 'block';
      details.style.display = isVisible ? 'none' : 'block';
      arrow.classList.toggle('open', !isVisible);
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

function openEditMenuModal(index) {
  const item = menuItems[index];

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
          <input type="number" id="menuTime" placeholder="Time (Min.)" value="${item.time || ''}" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ccc;">
          <input type="number" id="menuPrice" placeholder="Price" value="${item.price.replace('Rs.', '')}" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ccc;">
        </div>
        <div>
          <label>Name</label>
          <input type="text" id="menuName" value="${item.name}" placeholder="Name" style="width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 6px; border: 1px solid #ccc;">
          <label>Description</label>
          <textarea id="menuDesc" placeholder="Description" style="width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 6px; border: 1px solid #ccc; height: 80px;">${item.description || ''}</textarea>
          <label>Category</label><br/>
          <label><input type="radio" name="category" value="Starter" ${item.category === 'Starter' ? 'checked' : ''}> Starter</label>
          <label><input type="radio" name="category" value="Main Course" ${item.category === 'Main Course' ? 'checked' : ''}> Main Course</label>
          <label><input type="radio" name="category" value="Juice" ${item.category === 'Juice' ? 'checked' : ''}> Juice</label>
          <div style="text-align: right; margin-top: 20px;">
            <button onclick="saveEditedMenuItem(${index})" style="background: #28a745; color: white; padding: 8px 18px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">Save</button>
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
  const desc = document.getElementById('menuDesc').value;
  const time = document.getElementById('menuTime').value;
  const categoryInput = document.querySelector('input[name="category"]:checked');
  const category = categoryInput ? categoryInput.value : "Starter";

  menuItems.push({
    name,
    price,
    description: desc,
    time,
    category,
    available: true
  });

  closeMenuModal();
  renderMenuManagement();
  saveMenuToStorage();
}

function saveEditedMenuItem(index) {
  const name = document.getElementById('menuName').value;
  const price = "Rs." + document.getElementById('menuPrice').value;
  const desc = document.getElementById('menuDesc').value;
  const time = document.getElementById('menuTime').value;
  const categoryInput = document.querySelector('input[name="category"]:checked');
  const category = categoryInput ? categoryInput.value : "Starter";

  menuItems[index] = { 
    ...menuItems[index],
    name,
    price,
    description: desc,
    time,
    category
  };

  closeMenuModal();
  renderMenuManagement();
  saveMenuToStorage();
}

// === HELPER FUNCTIONS ===
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

function showDeleteConfirm(index, searchTerm) {
  document.getElementById('modal-root').innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 999;">
      <div style="background: white; padding: 20px 30px; border-radius: 8px; text-align: center; max-width: 400px;">
        <p style="font-size: 18px; margin-bottom: 20px;">Are you sure you want to delete this item?</p>
        <button style="background: #dc3545; color: white; padding: 6px 12px; border: none; border-radius: 4px; margin-right: 10px; cursor: pointer;"
          onclick="confirmDelete(${index}, '${searchTerm}')">Yes</button>
        <button style="background: #ccc; color: #333; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer;"
          onclick="closeMenuModal()">Cancel</button>
      </div>
    </div>
  `;
}

function confirmDelete(index, searchTerm) {
  menuItems.splice(index, 1);
  closeMenuModal();
  renderMenuCards(searchTerm);
  saveMenuToStorage();
}

function saveMenuToStorage() {
  localStorage.setItem('menuItems', JSON.stringify(menuItems));
}

// === NAVIGATION CLICK HANDLER ===
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

    pageTitle.textContent = (page === 'preManage' || page === 'menu' || page === 'delivery') 
      ? `${item.textContent.trim()} Management` 
      : item.textContent.trim();

    if (icons[page]) {
      iconBox.style.backgroundImage = `url('${icons[page]}')`;
    }

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

// === ACCESSIBILITY KEY HANDLER ===
document.querySelectorAll('.dropdown-toggle, .nav-item').forEach(el => {
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      el.click();
    }
  });
});
