import { openAddMenuModal, openEditMenuModal } from './modal.js';
import { renderHome } from './home.js';

let menuItems = [];
// Load from localStorage or set default + save
const storedMenu = localStorage.getItem('menuItems');
if (storedMenu) {
  menuItems = JSON.parse(storedMenu);
} else {
  menuItems = [
    { name: "Veg Burger", price: "Rs.120", available: true, category: "Starter", description: "Delicious veg patty burger", time: 10, image: null },
    { name: "Paneer Pizza", price: "Rs.250", available: false, category: "Starter", description: "Cheesy paneer pizza", time: 15, image: null },
    { name: "French Fries", price: "Rs.80", available: true, category: "Starter", description: "Crispy golden fries", time: 8, image: null },
    { name: "Cheese Sandwich", price: "Rs.150", available: true, category: "Main Course", description: "Grilled cheese sandwich", time: 12, image: null },
    { name: "Cold Coffee", price: "Rs.90", available: false, category: "Juice", description: "Chilled coffee delight", time: 5, image: null },
    { name: "Chicken Roll", price: "Rs.180", available: true, category: "Main Course", description: "Spicy chicken roll", time: 14, image: null },
    { name: "Mango Shake", price: "Rs.110", available: true, category: "Juice", description: "Fresh mango shake", time: 6, image: null },
    { name: "Veg Biryani", price: "Rs.200", available: false, category: "Main Course", description: "Aromatic veg biryani", time: 20, image: null }
  ];
  localStorage.setItem('menuItems', JSON.stringify(menuItems));  // ✅ Save defaults
}

export function loadMenuItems() {
  const stored = localStorage.getItem('menuItems');
  menuItems = stored ? JSON.parse(stored) : [];
}

export function renderMenuManagement() {
  loadMenuItems();

  document.getElementById('content-box').innerHTML = `
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
  document.getElementById('menuSearch').addEventListener('input', (e) => renderMenuCards(e.target.value.toLowerCase()));
  document.getElementById('sortMenu').addEventListener('change', () => {
    const searchValue = document.getElementById('menuSearch').value.toLowerCase();
    renderMenuCards(searchValue);
  });

  renderMenuCards('');
}

function renderMenuCards(searchTerm) {
  loadMenuItems();
  const sortValue = document.getElementById('sortMenu')?.value;

  let filteredItems = menuItems
    .map((item, originalIndex) => ({ ...item, originalIndex }))
    .filter(item =>
      !searchTerm ||
      item.name.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm)
    );

  if (sortValue === 'priceAsc') {
    filteredItems.sort((a, b) => parseInt(a.price.replace('Rs.', '')) - parseInt(b.price.replace('Rs.', '')) );
  } else if (sortValue === 'priceDesc') {
    filteredItems.sort((a, b) => parseInt(b.price.replace('Rs.', '')) - parseInt(a.price.replace('Rs.', '')) );
  } else if (sortValue === 'timeAsc') {
    filteredItems.sort((a, b) => (a.time || 0) - (b.time || 0));
  } else if (sortValue === 'timeDesc') {
    filteredItems.sort((a, b) => (b.time || 0) - (a.time || 0));
  }

  const grouped = {};
  filteredItems.forEach(item => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  });

  let html = '';
  Object.keys(grouped).forEach(category => {
    html += `<h3>${category}</h3>`;
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
              <button class="edit-btn" data-index="${item.originalIndex}">EDIT</button>
              <button class="availability-btn ${item.available ? 'available' : 'unavailable'}" data-index="${item.originalIndex}">
                ${item.available ? 'AVAILABLE' : 'UNAVAILABLE'}
              </button>
              <button class="delete-btn" data-index="${item.originalIndex}" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">DELETE</button>
              <span class="dropdown-arrow">▼</span>
            </div>
          </div>
          <div class="live-order-details" style="display: none; padding-left: 10px;">
            <p><strong>Description:</strong> ${item.description || "N/A"}</p>
            <p><strong>Category:</strong> ${item.category}</p>
            <p><strong>Time to prepare:</strong> ${item.time || "N/A"} min</p>
            ${item.image ? `<img src="${item.image}" alt="Item Image" style="max-width:100px; border-radius:6px; margin-top:8px;">` : ''}
          </div>
        </div>
      `;
    });
  });

  document.getElementById('menuCategories').innerHTML = html;

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openEditMenuModal(btn.dataset.index);
    });
  });

  document.querySelectorAll('.availability-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      loadMenuItems();
      const index = btn.dataset.index;
      menuItems[index].available = !menuItems[index].available;
      saveMenuToStorage();
      renderMenuCards(searchTerm);
      if (document.querySelector('.dashboard-view')) {
      renderDashboard();
}
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      showDeleteConfirm(btn.dataset.index, searchTerm);
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

function saveMenuToStorage() {
  localStorage.setItem('menuItems', JSON.stringify(menuItems));
}

function showDeleteConfirm(index, searchTerm) {
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 999;">
      <div style="background: white; padding: 20px 30px; border-radius: 8px; text-align: center; max-width: 400px;">
        <p style="font-size: 18px; margin-bottom: 20px;">Are you sure you want to delete this item?</p>
        <button id="confirmDeleteBtn" style="background: #dc3545; color: white; padding: 6px 12px; border: none; border-radius: 4px; margin-right: 10px; cursor: pointer;">Yes</button>
        <button id="cancelDeleteBtn" style="background: #ccc; color: #333; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
      </div>
    </div>
  `;
  document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    loadMenuItems();
    menuItems.splice(index, 1);
    saveMenuToStorage();
    renderMenuManagement();
    modalRoot.innerHTML = '';
  });
  document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
    modalRoot.innerHTML = '';
  });
}
export { menuItems };

