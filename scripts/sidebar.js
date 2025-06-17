// sidebar.js

export function setupSidebarDropdowns() {
  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = document.getElementById(toggle.dataset.target);
      const arrow = toggle.querySelector('.arrow');
      const isOpen = content.style.display === 'flex';
      content.style.display = isOpen ? 'none' : 'flex';
      arrow.classList.toggle('rotate', !isOpen);
      arrow.classList.toggle('black', !isOpen);
    });
  });
}

export function setupSidebarKeyboardAccess() {
  document.querySelectorAll('.dropdown-toggle, .nav-item').forEach(el => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });
}
