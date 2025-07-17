import { renderLoginPage, injectAuthStyles } from './auth.js';
import { setupSidebarDropdowns, setupSidebarKeyboardAccess } from './sidebar.js';
import { setupNavigation } from './navigation.js';
import { openAddMenuModal, openEditMenuModal } from './modal.js';
import { showToast } from './popup.js';

window.addEventListener('DOMContentLoaded', () => {
  injectAuthStyles();
  
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (isLoggedIn) {
    showDashboardAfterLogin();
  } else {
    renderLoginPage();
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    } else {
      setTimeout(() => {
        if (window.lucide) lucide.createIcons();
      }, 50);
    }
  }
});

window.openAddMenuModal = openAddMenuModal;
window.openEditMenuModal = openEditMenuModal;

export function showDashboardAfterLogin() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('dashboard').style.display = 'flex';
  
  setupSidebarDropdowns();
  setupSidebarKeyboardAccess();
  setupNavigation();
  
  setTimeout(() => {
    document.querySelector('[data-page="home"]')?.click();
  }, 50);

  setTimeout(() => {
    setupProfileDropdown();
  }, 200);
}

function setupProfileDropdown() {
  const tryBind = () => {
    const profilePic = document.getElementById('top-profile-pic');
    const dropdown = document.getElementById('profile-dropdown');
    
    if (!profilePic || !dropdown) return false;

    const newProfilePic = profilePic.cloneNode(true);
    profilePic.parentNode.replaceChild(newProfilePic, profilePic);
    
    dropdown.classList.remove('show');
    dropdown.style.display = 'none';
    
    newProfilePic.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        dropdown.style.display = 'none';
      } else {
        dropdown.classList.add('show');
        dropdown.style.display = 'block';
      }
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !newProfilePic.contains(e.target)) {
        dropdown.classList.remove('show');
        dropdown.style.display = 'none';
      }
    });

    return true;
  };

  if (tryBind()) return;

  let attempts = 0;
  const maxAttempts = 30;
  
  const interval = setInterval(() => {
    attempts++;
    if (tryBind()) {
      clearInterval(interval);
    } else if (attempts >= maxAttempts) {
      clearInterval(interval);
    }
  }, 100);
}

function setupProfileDropdownAlternative() {
  const checkAndSetup = () => {
    const profilePic = document.querySelector('#top-profile-pic, [data-profile-trigger], .profile-trigger');
    const dropdown = document.querySelector('#profile-dropdown, [data-profile-dropdown], .profile-dropdown');
    
    if (profilePic && dropdown) {
      profilePic.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        dropdown.classList.toggle('show');
      });

      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && !profilePic.contains(e.target)) {
          dropdown.style.display = 'none';
          dropdown.classList.remove('show');
        }
      });

      return true;
    }
    return false;
  };
  
  if (!checkAndSetup()) {
    setTimeout(checkAndSetup, 500);
  }
}

window.setupProfileDropdownAlternative = setupProfileDropdownAlternative;
