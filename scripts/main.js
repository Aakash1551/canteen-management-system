// main.js

import { renderLoginPage, injectAuthStyles } from './auth.js';
import { setupSidebarDropdowns, setupSidebarKeyboardAccess } from './sidebar.js';
import { setupNavigation } from './navigation.js';
import { openAddMenuModal, openEditMenuModal } from './modal.js';

// Run on page load
window.addEventListener('DOMContentLoaded', () => {
  injectAuthStyles();
console.log('Lucide available?', typeof lucide); // should log "object"

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (isLoggedIn) {
    showDashboardAfterLogin();  // ✅ skip login screen
  } else {
    renderLoginPage();
    if (window.lucide && typeof lucide.createIcons === 'function') {
  lucide.createIcons();
} else {
  // Try again after short delay (fallback)
  setTimeout(() => {
    if (window.lucide) lucide.createIcons();
  }, 50);
}


  }
});

// Global modal functions for add/edit menu
window.openAddMenuModal = openAddMenuModal;
window.openEditMenuModal = openEditMenuModal;

// 🔁 Called after successful login
export function showDashboardAfterLogin() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('dashboard').style.display = 'flex';

  // 🧠 Initialize UI logic
  setupSidebarDropdowns();
  setupSidebarKeyboardAccess();
  setupNavigation();

  // ✅ Delay initial navigation to fix heading-card layout issue
  setTimeout(() => {
    document.querySelector('[data-page="home"]')?.click();
  }, 50);

  // ✅ Delay profile setup so DOM is ready
  setTimeout(() => {
    setupProfileDropdown();
  }, 100);
}


// ✅ Profile dropdown click logic
function setupProfileDropdown() {
  const profilePic = document.getElementById('top-profile-pic');
  const dropdown = document.getElementById('profile-dropdown');

  if (!profilePic || !dropdown) {
    console.warn("❌ Profile image or dropdown not found.");
    return;
  }

  profilePic.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    const wrapper = document.querySelector('.profile-wrapper');
    if (!wrapper?.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}
