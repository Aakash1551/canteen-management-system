// Import sidebar functionality: dropdowns + keyboard access for accessibility
import { setupSidebarDropdowns, setupSidebarKeyboardAccess } from './sidebar.js';

// Import navigation setup (handles page switching when sidebar items are clicked)
import { setupNavigation } from './navigation.js';

// Import modal functions for adding/editing menu items (exposed to global for button use)
import { openAddMenuModal, openEditMenuModal } from './modal.js';

// Run setup when DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
  // Initialize sidebar dropdown toggle behavior (Order / Manage sections)
  setupSidebarDropdowns();

  // Enable keyboard navigation (Enter / Space) for sidebar items
  setupSidebarKeyboardAccess();

  // Set up navigation between pages (Home, Menu, Orders, Contact, etc.)
  setupNavigation();

  // Render initial welcome message in content box
  document.getElementById('content-box').innerHTML = `
    <div style="padding: 30px; text-align: center;">
      <h2 style="font-size: 32px;">Welcome to the Dashboard!</h2>
      <p style="font-size: 18px; color: #555;">Select an option from the sidebar to get started.</p>
    </div>
  `;
});

// Expose modal functions globally so other scripts (like inline button clicks) can trigger them
window.openAddMenuModal = openAddMenuModal;
window.openEditMenuModal = openEditMenuModal;
