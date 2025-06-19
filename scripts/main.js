// main.js

import { renderLoginPage, injectAuthStyles } from './auth.js';
import { setupSidebarDropdowns, setupSidebarKeyboardAccess } from './sidebar.js';
import { setupNavigation } from './navigation.js';
import { openAddMenuModal, openEditMenuModal } from './modal.js';

// Run on page load
window.addEventListener('DOMContentLoaded', () => {
  // 🔐 Show login/signup first
  injectAuthStyles();
  renderLoginPage();
});

// Global modal functions for add/edit menu
window.openAddMenuModal = openAddMenuModal;
window.openEditMenuModal = openEditMenuModal;

// 🔁 This function will be called after login success from auth.js
export function showDashboardAfterLogin() {
  // Hide auth screen
  document.getElementById('auth-screen').style.display = 'none';

  // Show dashboard container
  document.getElementById('dashboard').style.display = 'flex';

  // If "Profile" not already added, add it
  if (!document.querySelector('[data-page="profile"]')) {
    const contactBox = document.querySelector('[data-page="contact"]').closest('.box2');
    const profileBox = document.createElement('div');
    profileBox.className = 'box nav-item';
    profileBox.setAttribute('data-page', 'profile');
    profileBox.innerHTML = `<div class="icon icon-login"></div><div class="text">Profile</div>`;
    contactBox.insertAdjacentElement('afterend', profileBox);
  }

  // Re-initialize sidebar + nav
  setupSidebarDropdowns();
  setupSidebarKeyboardAccess();
  setupNavigation();
}
