import { renderMenuManagement } from './menu.js';

export function openAddMenuModal() {
  removeExistingModal();
  const modal = createModalHTML();
  document.getElementById('modal-root').appendChild(modal);
  setupModalEvents(modal, null);
}

export function openEditMenuModal(index) {
  removeExistingModal();
  const items = JSON.parse(localStorage.getItem('menuItems')) || [];
  const item = items[index];
  const modal = createModalHTML(item);
  document.getElementById('modal-root').appendChild(modal);
  setupModalEvents(modal, index);
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
            + upload image
            <input type="file" name="menuImage" style="display:none">
          </label>
          <input type="number" name="menuTime" placeholder="Time (Min.)" value="${data.time || ''}" class="input-styled">
          <input type="number" name="menuPrice" placeholder="Price" value="${(data.price || '').replace('Rs.', '')}" class="input-styled">
        </div>
        <div class="modal-right">
          <input type="text" name="menuName" placeholder="Name" value="${data.name || ''}" class="input-styled">
          <textarea name="menuDesc" placeholder="Description" class="textarea-styled">${data.description || ''}</textarea>
          <div class="category-group">
  <label><input type="radio" name="category" value="Starter" ${data.category === 'Starter' ? 'checked' : ''}> Starter</label>
  <label><input type="radio" name="category" value="Main Course" ${data.category === 'Main Course' ? 'checked' : ''}> Main Course</label>
  <label><input type="radio" name="category" value="Juice" ${data.category === 'Juice' ? 'checked' : ''}> Juice</label>
</div>
<input type="text" name="customCategory" placeholder="Or enter custom section (e.g. Chinese, Ice Cream)" class="input-styled" value="${data.category && !['Starter','Main Course','Juice'].includes(data.category) ? data.category : ''}">

        </div>
      </div>
      <button class="modal-save-styled">Save</button>
    </div>
  `;
  return div;
}

function setupModalEvents(modal, editIndex) {
  let imageData = null; // To hold uploaded image data

  modal.querySelector('.modal-close-styled').addEventListener('click', () => modal.remove());

  modal.querySelector('.modal-save-styled').addEventListener('click', () => {
    const item = readModalForm(modal);
    if (item) {
      if (imageData) {
        item.image = imageData;
      } else if (editIndex !== null) {
        const items = JSON.parse(localStorage.getItem('menuItems')) || [];
        item.image = items[editIndex]?.image || null; // retain existing image if no new upload
      } else {
        item.image = null;
      }

      let items = JSON.parse(localStorage.getItem('menuItems')) || [];
      if (editIndex === null) {
        items.push({ ...item, available: true });
      } else {
        items[editIndex] = { ...items[editIndex], ...item };
      }
      localStorage.setItem('menuItems', JSON.stringify(items));
      modal.remove();
      renderMenuManagement();
    }
  });

  modal.querySelector('[name="menuImage"]').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        imageData = evt.target.result; // save base64
        modal.querySelector('.image-upload-box').innerHTML = `
          <img src="${imageData}" alt="Uploaded" style="max-width:100%; border-radius:6px;">
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
    price: "Rs." + price,
    description: desc,
    time,
    category: customCat || selectedCat
  };
}

