import { renderMenuManagement } from './menu.js';

export function openAddMenuModal() {
  removeExistingModal();
  const modal = createModalHTML();
  document.getElementById('modal-root').appendChild(modal);
  setupModalEvents(modal, null);
}

export async function openEditMenuModal(itemId) {
  removeExistingModal();

  const token = localStorage.getItem('authToken');
  let item = null;

  try {
    const res = await fetch(`http://192.168.213.174:8000/api/menu/${itemId}/`, {
      headers: {
        Authorization: `Token ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to fetch item');
    item = await res.json();
  } catch (err) {
    alert("Failed to load item");
    return;
  }

  const modal = createModalHTML(item);
  document.getElementById('modal-root').appendChild(modal);
  setupModalEvents(modal, itemId);
}

function removeExistingModal() {
  const existing = document.querySelector('.modal-overlay');
  if (existing) existing.remove();
}

function createModalHTML(data = {}) {
  const div = document.createElement('div');
  div.className = 'modal-overlay';
  div.innerHTML = `
    <div class="modal-box-styled">
      <button class="modal-close-styled">X</button>
      <div class="modal-content-styled">
        <div class="modal-left">
          <label class="image-upload-box">
            ${data.image ? `<img src="${data.image}" alt="Item" style="max-width:100%; border-radius:6px;">` : '+ upload image'}
            <input type="file" name="menuImage" style="display:none">
          </label>
          <input type="number" name="menuTime" placeholder="Time (Min.)" value="${data.prep_time || ''}" class="input-styled">
          <input type="number" name="menuPrice" placeholder="Price" value="${data.price || ''}" class="input-styled">
        </div>
        <div class="modal-right">
          <input type="text" name="menuName" placeholder="Name" value="${data.name || ''}" class="input-styled">
          <textarea name="menuDesc" placeholder="Description" class="textarea-styled">${data.description || ''}</textarea>
          <div class="category-group">
            <label><input type="radio" name="category" value="Starter" ${data.category === 'Starter' ? 'checked' : ''}> Starter</label>
            <label><input type="radio" name="category" value="Main Course" ${data.category === 'Main Course' ? 'checked' : ''}> Main Course</label>
            <label><input type="radio" name="category" value="Juice" ${data.category === 'Juice' ? 'checked' : ''}> Juice</label>
          </div>
          <input type="text" name="customCategory" placeholder="Or enter custom section" class="input-styled" value="${data.category && !['Starter','Main Course','Juice'].includes(data.category) ? data.category : ''}">
        </div>
      </div>
      <button class="modal-save-styled">Save</button>
    </div>
  `;
  return div;
}

function setupModalEvents(modal, itemId) {
  let imageFile = null;

  modal.querySelector('.modal-close-styled').addEventListener('click', () => modal.remove());

  modal.querySelector('.modal-save-styled').addEventListener('click', async () => {
    const item = readModalForm(modal);
    if (!item) return;

    const formData = new FormData();
    formData.append('name', item.name);
    formData.append('description', item.description);
    formData.append('price', item.price);
    formData.append('category', item.category);
    formData.append('prep_time', item.time || 0);
    formData.append('available', true);
    formData.append('stock_count', 20);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const token = localStorage.getItem('authToken');
    const url = itemId
      ? `http://192.168.213.174:8000/api/menu/update/${itemId}/`
      : `http://192.168.213.174:8000/api/menu/add/`;

    const method = itemId ? 'PUT' : 'POST'; // ✅ FIXED PATCH → PUT

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Error: " + JSON.stringify(err));
        return;
      }

      modal.remove();
      renderMenuManagement();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  });

  modal.querySelector('[name="menuImage"]').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      imageFile = file;
      const reader = new FileReader();
      reader.onload = function (evt) {
        const preview = evt.target.result;
        modal.querySelector('.image-upload-box').innerHTML = `
          <img src="${preview}" alt="Uploaded" style="max-width:100%; border-radius:6px;">
        `;
      };
      reader.readAsDataURL(file);
    }
  });
}

function readModalForm(modal) {
  const name = modal.querySelector('[name="menuName"]').value.trim();
  const price = modal.querySelector('[name="menuPrice"]').value.trim();
  const desc = modal.querySelector('[name="menuDesc"]').value.trim();
  const time = modal.querySelector('[name="menuTime"]').value.trim();
  const customCat = modal.querySelector('[name="customCategory"]').value.trim();
  const selectedCat = modal.querySelector('input[name="category"]:checked')?.value;

  if (!name || !price || (!customCat && !selectedCat)) {
    alert('Please fill in name, price, and category');
    return null;
  }

  return {
    name,
    price,
    description: desc,
    time,
    category: customCat || selectedCat
  };
}
