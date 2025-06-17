// Import render function to refresh menu UI after add/edit
import { renderMenuManagement } from './menu.js';

/**
 * Open modal for adding a new menu item
 */
export function openAddMenuModal() {
  removeExistingModal();  // Ensure no duplicate modal

  const modal = createModalHTML();  // Create blank form
  document.getElementById('modal-root').appendChild(modal);

  setupModalEvents(modal, null);  // Setup save/cancel for add mode
}

/**
 * Open modal for editing an existing menu item
 * @param {number} index - index of the item in localStorage array
 */
export function openEditMenuModal(index) {
  removeExistingModal();  // Ensure no duplicate modal

  const items = JSON.parse(localStorage.getItem('menuItems')) || [];
  const item = items[index];  // Get item data

  const modal = createModalHTML(item);  // Pre-fill form with item data
  document.getElementById('modal-root').appendChild(modal);

  setupModalEvents(modal, index);  // Setup save/cancel for edit mode
}

/**
 * Utility to remove any existing modal overlay
 */
function removeExistingModal() {
  const existingModal = document.querySelector('.modal-overlay');
  if (existingModal) existingModal.remove();
}

/**
 * Create modal HTML with optional pre-filled data
 * @param {object} data - item data to prefill (for edit)
 */
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
        </div>
      </div>
      <button class="modal-save-styled">Save</button>
    </div>
  `;
  return div;
}

/**
 * Attach event handlers for modal save and close buttons
 * @param {HTMLElement} modal - the modal element
 * @param {number|null} editIndex - null if add mode, index if edit mode
 */
function setupModalEvents(modal, editIndex) {
  // Close button handler
  modal.querySelector('.modal-close-styled').addEventListener('click', () => modal.remove());

  // Save button handler
  modal.querySelector('.modal-save-styled').addEventListener('click', () => {
    const item = readModalForm(modal);
    if (item) {
      let items = JSON.parse(localStorage.getItem('menuItems')) || [];
      if (editIndex === null) {
        // Add mode
        items.push({ ...item, available: true });
      } else {
        // Edit mode
        items[editIndex] = { ...items[editIndex], ...item };
      }
      localStorage.setItem('menuItems', JSON.stringify(items));  // Save updated list
      modal.remove();
      renderMenuManagement();  // Refresh UI
    }
  });
}

/**
 * Read and validate form data from modal
 * @param {HTMLElement} modal - the modal element
 * @returns {object|null} - form data or null if invalid
 */
function readModalForm(modal) {
  const name = modal.querySelector('[name="menuName"]').value.trim();
  const price = modal.querySelector('[name="menuPrice"]').value.trim();
  const desc = modal.querySelector('[name="menuDesc"]').value.trim();
  const time = modal.querySelector('[name="menuTime"]').value.trim();
  const category = modal.querySelector('input[name="category"]:checked')?.value;

  if (!name || !price || !category) {
    alert('Please fill in name, price, and category');
    return null;
  }

  return {
    name,
    price: "Rs." + price,
    description: desc,
    time,
    category
  };
}
