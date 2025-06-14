// Dropdown toggle
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

// Page content loader
const pages = {
  home: ``,
  liveOrder: `
    <div class="live-orders-container">
    <div class="live-order-card">
      <div class="live-order-header">
        <span>Name 01</span>
        <span>Order #61</span>
        <span>Rs.350</span>
      </div>
      <div class="live-order-items">
        1x French Fries<br>
        2x Coke<br>
        1x Veg Roll<br>
        2x Maggie
      </div>
      <div class="live-order-actions">
        <span class="btn-ready">MARK AS READY</span>
        <span class="btn-delivered">DELIVERED</span>
      </div>
    </div>

    <div class="live-order-card">
      <div class="live-order-header">
        <span>Name 02</span>
        <span>Order #62</span>
        <span>Rs.100</span>
      </div>
      <div class="live-order-items">
        1x Tea<br>
        1x Biscuit
      </div>
      <div class="live-order-actions">
        <span class="btn-ready">MARK AS READY</span>
        <span class="btn-delivered">DELIVERED</span>
      </div>
    </div>
  </div>

  `,
  preOrder: `<h2>Pre-Order Page</h2>`,
  history: `<h2>Order History Page</h2>`,
  preManage: `<h2>Pre-Manage Page</h2>`,
  menu: `<h2>Menu Page</h2>`,
  delivery: `<h2>Delivery Management Page</h2>`,
};

const contentBox = document.getElementById('content-box');
const pageTitle = document.getElementById('page-title');

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    // Update content
    const page = item.dataset.page;
    contentBox.innerHTML = pages[page];
    pageTitle.textContent = item.textContent.trim();

    // Remove previous active classes
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});
