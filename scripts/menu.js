import { openAddMenuModal, openEditMenuModal } from './modal.js';
import { renderHome } from './home.js';

let menuItems = [];

function getAuthHeaders(extra = {}) {
  const token = localStorage.getItem('authToken');
  return {
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...extra,
  };
}

export async function loadMenuItems() {
  try {
    const response = await fetch('http://192.168.213.174:8000/api/menu/', {
      headers: getAuthHeaders(),
    });
    menuItems = await response.json();
  } catch (err) {
    console.error('Failed to load menu items', err);
    menuItems = [];
  }
}

export function renderMenuManagement() {
  loadMenuItems().then(() => {
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
  });
}

function renderMenuCards(searchTerm) {
  const sortValue = document.getElementById('sortMenu')?.value;

  let filteredItems = menuItems.filter(item =>
    !searchTerm ||
    item.name.toLowerCase().includes(searchTerm) ||
    item.category.toLowerCase().includes(searchTerm)
  );

  if (sortValue === 'priceAsc') {
    filteredItems.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (sortValue === 'priceDesc') {
    filteredItems.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  } else if (sortValue === 'timeAsc') {
    filteredItems.sort((a, b) => (a.prep_time || 0) - (b.prep_time || 0));
  } else if (sortValue === 'timeDesc') {
    filteredItems.sort((a, b) => (b.prep_time || 0) - (a.prep_time || 0));
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
            <span><strong>Rs.${item.price}</strong></span>
            <div class="menu-actions">
              <button class="edit-btn" data-id="${item.id}">EDIT</button>
              <button class="availability-btn ${item.available ? 'available' : 'unavailable'}" data-id="${item.id}">
                ${item.available ? 'AVAILABLE' : 'UNAVAILABLE'}
              </button>
              <button class="delete-btn" data-id="${item.id}" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">DELETE</button>
              <span class="dropdown-arrow">▼</span>
            </div>
          </div>
          <div class="live-order-details" style="display: none; padding-left: 10px;">
            <p><strong>Description:</strong> ${item.description || "N/A"}</p>
            <p><strong>Category:</strong> ${item.category}</p>
            <p><strong>Time to prepare:</strong> ${item.prep_time || "N/A"} min</p>
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
      openEditMenuModal(btn.dataset.id);
    });
  });

  // ✅ AVAILABILITY TOGGLE — FULL OBJECT WITH PUT
  document.querySelectorAll('.availability-btn').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const item = menuItems.find(m => m.id == id);
      if (!item) return;

      try {
        await fetch(`http://192.168.213.174:8000/api/menu/update/${id}/`, {
          method: 'PUT',
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            prep_time: item.prep_time,
            available: !item.available,
            stock_count: item.stock_count
          }),
        });

        await loadMenuItems();
        renderMenuCards(document.getElementById('menuSearch').value.toLowerCase());
      } catch (err) {
        console.error('Error updating availability', err);
      }
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      showDeleteConfirm(btn.dataset.id, searchTerm);
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

function showDeleteConfirm(id, searchTerm) {
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

  document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    try {
      await fetch(`http://192.168.213.174:8000/api/menu/delete/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      await loadMenuItems();
      renderMenuCards(searchTerm);
    } catch (err) {
      console.error('Delete failed', err);
    }
    modalRoot.innerHTML = '';
  });

  document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
    modalRoot.innerHTML = '';
  });
}

export { menuItems };
