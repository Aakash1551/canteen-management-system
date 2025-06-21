// main.js

import { renderLoginPage, injectAuthStyles } from './auth.js';
import { setupSidebarDropdowns, setupSidebarKeyboardAccess } from './sidebar.js';
import { setupNavigation } from './navigation.js';
import { openAddMenuModal, openEditMenuModal } from './modal.js';

// Run on page load
window.addEventListener('DOMContentLoaded', () => {
  injectAuthStyles();

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (isLoggedIn) {
    showDashboardAfterLogin();  // ✅ skip login screen
  } else {
    renderLoginPage();
  }
});

// Global modal functions for add/edit menu
window.openAddMenuModal = openAddMenuModal;
window.openEditMenuModal = openEditMenuModal;

// 🔁 Called after successful login
export function showDashboardAfterLogin() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('dashboard').style.display = 'flex';

  // Add Profile Button if not already
  if (!document.querySelector('[data-page="profile"]')) {
    const contactBox = document.querySelector('[data-page="contact"]').closest('.box2');
    const profileBox = document.createElement('div');
    profileBox.className = 'box nav-item';
    profileBox.setAttribute('data-page', 'profile');
    profileBox.innerHTML = `<div class="icon icon-login"></div><div class="text">Profile</div>`;
    contactBox.insertAdjacentElement('afterend', profileBox);
  }

  // 🧠 Initialize UI logic
  setupSidebarDropdowns();
  setupSidebarKeyboardAccess();
  setupNavigation();

  // ✅ Auto-load Home page
  document.querySelector('[data-page="home"]')?.click();

  // ✅ Delay profile setup so DOM is ready
  setTimeout(() => {
    setupProfileDropdown();
  }, 50);
}


// ✅ Profile dropdown click logic
function setupProfileDropdown() {
  const profilePic = document.getElementById('top-profile-pic');
  const dropdown = document.getElementById('profile-dropdown');

  console.log("👀 profilePic:", profilePic);
  console.log("👀 dropdown:", dropdown);

  if (!profilePic || !dropdown) {
    console.warn("❌ Profile image or dropdown not found.");
    return;
  }

  profilePic.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log("✅ Profile pic clicked");
    dropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    const wrapper = document.querySelector('.profile-wrapper');
    if (!wrapper?.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}
