function loadFromStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export let liveOrders = loadFromStorage('liveOrders');
export let preOrders = loadFromStorage('preOrders');
export let historyOrders = loadFromStorage('historyOrders');
export let preOrderHistory = loadFromStorage('preOrderHistory');

// 🧪 Dummy data only once
if (liveOrders.length === 0 && preOrders.length === 0) {
  function randomTime() {
    const hour = Math.floor(Math.random() * 12) + 1;
    const minute = Math.floor(Math.random() * 60);
    const ampm = Math.random() > 0.5 ? 'AM' : 'PM';
    return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  }

  for (let i = 1; i <= 20; i++) {
    liveOrders.push({
      name: `Customer ${i}`,
      orderNo: `#${i}`,
      price: `Rs.${Math.floor(Math.random() * 500) + 100}`,
      items: ["1x Item A", "2x Item B", "1x Item C"],
      placedAt: randomTime()
    });

    const startHour = Math.floor(4 + Math.random() * 6); // 4 to 9 PM
    const endHour = startHour + 1;
    const deliveryWindow = `${startHour}:00 PM - ${endHour}:00 PM`;

    preOrders.push({
      name: `Customer ${i}`,
      orderNo: `#${i}`,
      price: `Rs.${Math.floor(Math.random() * 500) + 100}`,
      items: ["1x Item A", "2x Item B", "1x Item C"],
      placedAt: randomTime(),
      deliveryWindow: deliveryWindow
    });
  }

  saveToStorage('liveOrders', liveOrders);
  saveToStorage('preOrders', preOrders);
}

export function persistOrders() {
  saveToStorage('liveOrders', liveOrders);
  saveToStorage('preOrders', preOrders);
  saveToStorage('historyOrders', historyOrders);
  saveToStorage('preOrderHistory', preOrderHistory);
}

// ✅ LIVE ORDERS
export function renderLiveOrders() {
  const contentBox = document.getElementById('content-box');
  contentBox.className = 'content-box';
  contentBox.style.display = 'flex';
  contentBox.style.flexDirection = 'column';
  contentBox.style.alignItems = 'center';
  contentBox.style.height = 'calc(100vh - 10vh - 20px)';
  contentBox.style.padding = '10px';

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
        <div style="margin-top: 5px; font-size: 12px; color: #666;">
          Placed at: ${order.placedAt}
        </div>
      </div>
    </div>
  `).join('');

  contentBox.innerHTML = `<div class="live-orders-container">${html}</div>`;
  setupOrderDropdowns();
  setupDeliveredButtons('live');
}

// ✅ PRE-ORDERS
export function renderPreOrders() {
  const contentBox = document.getElementById('content-box');
  contentBox.className = 'content-box';
  contentBox.style.display = 'flex';
  contentBox.style.flexDirection =  'column';
  contentBox.style.alignItems = 'center';
  contentBox.style.height = 'calc(100vh - 10vh - 20px)';
  contentBox.style.padding = '10px';

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
        <div style="margin-top: 5px; font-size: 12px; color: #666;">
          Placed at: ${order.placedAt}<br>
          Delivery window: ${order.deliveryWindow}
        </div>
      </div>
    </div>
  `).join('');

  contentBox.innerHTML = `<div class="live-orders-container">${html}</div>`;
  setupOrderDropdowns();
  setupDeliveredButtons('pre');
}

// 🔽 Toggle dropdown
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

// ✅ DELIVERY BUTTONS
export function setupDeliveredButtons(type) {
  const selector = type === 'live' ? '.live-delivered' : '.pre-delivered';
  document.querySelectorAll(selector).forEach(btn => {
    btn.addEventListener('click', () => {
      const orderNo = btn.dataset.order;
      const list = type === 'live' ? liveOrders : preOrders;
      const history = type === 'live' ? historyOrders : preOrderHistory;
      const index = list.findIndex(o => o.orderNo === orderNo);
      if (index !== -1) {
        history.push(list[index]);
        list.splice(index, 1);
        persistOrders();
        type === 'live' ? renderLiveOrders() : renderPreOrders();

        if (document.querySelector('.dashboard-view')) {
          renderDashboard();
        }
      }
    });
  });
}
