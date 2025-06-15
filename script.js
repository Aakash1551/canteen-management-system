// === Sidebar Dropdown Toggle ===
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

// === Data ===
// let liveOrders = [
//   {
//     name: "Name 01",
//     orderNo: "#61",
//     price: "Rs.350",
//     items: ["1x French Fries", "2x Coke", "1x Veg Roll", "2x Maggie"]
//   },
//   {
//     name: "Name 02",
//     orderNo: "#62",
//     price: "Rs.100",
//     items: ["1x Tea", "1x Biscuit"]
//   }
// ];
let liveOrders = [];

for (let i = 1; i <= 20; i++) {  // 20 orders generate karega, scroll check ke liye perfect hai
  liveOrders.push({
    name: `Customer ${i}`,
    orderNo: `#${i}`,
    price: `Rs.${Math.floor(Math.random() * 500) + 100}`,
    items: [
      "1x Item A",
      "2x Item B",
      "1x Item C"
    ]
  });
}


let historyOrders = [];

// let preOrders = [
//   {
//     name: "Name 03",
//     orderNo: "#71",
//     price: "Rs.200",
//     items: ["1x Burger", "1x Sprite"]
//   }
// ];

let preOrders = [];

for (let i = 1; i <= 20; i++) {  // 20 orders generate karega, scroll check ke liye perfect hai
  preOrders.push({
    name: `Customer ${i}`,
    orderNo: `#${i}`,
    price: `Rs.${Math.floor(Math.random() * 500) + 100}`,
    items: [
      "1x Item A",
      "2x Item B",
      "1x Item C"
    ]
  });
}

let preOrderHistory = [];

// === Render Functions ===
function renderLiveOrders() {
  const html = liveOrders.map(order => `
    <div class="live-order-card">
      <div class="live-order-header">
        <span><strong>${order.name}</strong></span>
        <span><strong>Order ${order.orderNo}</strong></span>
        <span><strong>${order.price}</strong></span>
        <span class="btn-ready">MARK AS READY</span>
        <span class="btn-delivered live-delivered" data-order="${order.orderNo}">DELIVERED</span>
        <span class="dropdown-arrow">▼</span>
      </div>
      <div class="live-order-details" style="display: none;">
        ${order.items.join('<br>')}
      </div>
    </div>
  `).join('');

  contentBox.innerHTML = `<div class="live-orders-container">${html}</div>`;
  setupOrderDropdowns();
  setupDeliveredButtons('live');
}

function renderPreOrders() {
  const html = preOrders.map(order => `
    <div class="live-order-card">
      <div class="live-order-header">
        <span><strong>${order.name}</strong></span>
        <span><strong>Order ${order.orderNo}</strong></span>
        <span><strong>${order.price}</strong></span>
        <span class="btn-ready">MARK AS READY</span>
        <span class="btn-delivered pre-delivered" data-order="${order.orderNo}">DELIVERED</span>
        <span class="dropdown-arrow">▼</span>
      </div>
      <div class="live-order-details" style="display: none;">
        ${order.items.join('<br>')}
      </div>
    </div>
  `).join('');

  contentBox.innerHTML = `<div class="live-orders-container">${html}</div>`;
  setupOrderDropdowns();
  setupDeliveredButtons('pre');
}

function renderHistory() {
  const liveHtml = historyOrders.map(order => `
    <div class="live-order-card">
      <div class="live-order-header">
        <span><strong>${order.name}</strong></span>
        <span><strong>Order ${order.orderNo}</strong></span>
        <span><strong>${order.price}</strong></span>
      </div>
    </div>
  `).join('');

  const preHtml = preOrderHistory.map(order => `
    <div class="live-order-card">
      <div class="live-order-header">
        <span><strong>${order.name} (Pre-Order)</strong></span>
        <span><strong>Order ${order.orderNo}</strong></span>
        <span><strong>${order.price}</strong></span>
      </div>
    </div>
  `).join('');

  contentBox.innerHTML = `
    <div class="live-orders-container">
      <h3>Live Order History</h3>
      ${liveHtml || "<p>No live order history</p>"}
      <h3>Pre-Order History</h3>
      ${preHtml || "<p>No pre-order history</p>"}
    </div>
  `;
}

// === Helpers ===
function setupOrderDropdowns() {
  document.querySelectorAll('.dropdown-arrow').forEach(arrow => {
    arrow.addEventListener('click', () => {
      const details = arrow.parentElement.nextElementSibling;
      const isVisible = details.style.display === 'block';
      details.style.display = isVisible ? 'none' : 'block';
      arrow.classList.toggle('open', !isVisible);
    });
  });
}

function setupDeliveredButtons(type) {
  if (type === 'live') {
    document.querySelectorAll('.live-delivered').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderNo = btn.dataset.order;
        const index = liveOrders.findIndex(o => o.orderNo === orderNo);
        if (index !== -1) {
          historyOrders.push(liveOrders[index]);
          liveOrders.splice(index, 1);
          renderLiveOrders();
        }
      });
    });
  } else if (type === 'pre') {
    document.querySelectorAll('.pre-delivered').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderNo = btn.dataset.order;
        const index = preOrders.findIndex(o => o.orderNo === orderNo);
        if (index !== -1) {
          preOrderHistory.push(preOrders[index]);
          preOrders.splice(index, 1);
          renderPreOrders();
        }
      });
    });
  }
}

// === Nav Click Handler ===
const icons = {
  home: 'grid-9.svg',
  liveOrder: 'Union-1.svg',
  preOrder: 'Union-1.svg',
  history: 'Union-1.svg',
  preManage: 'Subtract-1.svg',
  menu: 'Subtract-1.svg',
  delivery: 'Subtract-1.svg',
};

const contentBox = document.getElementById('content-box');
const pageTitle = document.getElementById('page-title');
const iconBox = document.getElementById('heading-icon');

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const page = item.dataset.page;

    if (page === 'liveOrder') {
      renderLiveOrders();
    } else if (page === 'preOrder') {
      renderPreOrders();
    } else if (page === 'history') {
      renderHistory();
    } else {
      contentBox.innerHTML = `<h2>${item.textContent.trim()} Page</h2>`;
    }

    if (page === 'preManage' || page === 'menu' || page === 'delivery') {
      pageTitle.textContent = `${item.textContent.trim()} Management`;
    } else {
      pageTitle.textContent = item.textContent.trim();
    }

    if (icons[page]) {
      iconBox.style.backgroundImage = `url('${icons[page]}')`;
    }

    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    if (page === 'home') {
      contentBox.style.background = '#fff';
      contentBox.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    } else {
      contentBox.style.background = 'none';
      contentBox.style.boxShadow = 'none';
    }
  });
});
