// navigation.js
import { renderLiveOrders, renderPreOrders } from './orders.js';
import { renderMenuManagement } from './menu.js';
import { renderContactPage } from './contact.js';
import { renderHistory } from './history.js';
import { renderCustomOrderPage } from './customOrder.js';

export function setupNavigation() {
  const contentBox = document.getElementById('content-box');
  const pageTitle = document.getElementById('page-title');
  const iconBox = document.getElementById('heading-icon');

  const icons = {
    home: 'icons/home-black.svg',
    liveOrder: 'icons/order-black.svg',
    preOrder: 'icons/order-black.svg',
    history: 'icons/order-black.svg',
    preManage: 'icons/manage-black.svg',
    menu: 'icons/manage-black.svg',
    delivery: 'icons/manage-black.svg',
    contact: 'icons/contact-black.svg'
  };

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;

      switch (page) {
        case 'liveOrder':
          renderLiveOrders();
          break;
        case 'preOrder':
          renderPreOrders();
          break;
        case 'history':
          renderHistory();
          break;
        case 'menu':
          renderMenuManagement();
          break;
        case 'contact':
          renderContactPage();
          break;
        case 'customOrder':
          renderCustomOrderPage();
          break;
        default:
          contentBox.innerHTML = `<h2>${item.textContent.trim()} Page</h2>`;
      }

      pageTitle.textContent = (page === 'preManage' || page === 'menu' || page === 'delivery') 
        ? `${item.textContent.trim()} Management` 
        : item.textContent.trim();

      if (icons[page]) {
        iconBox.style.backgroundImage = `url('${icons[page]}')`;
      }

      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      if (page === 'home' || page === 'contact') {
        contentBox.style.background = '#fff';
        contentBox.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      } else {
        contentBox.style.background = 'none';
        contentBox.style.boxShadow = 'none';
      }
    });
  });
}
