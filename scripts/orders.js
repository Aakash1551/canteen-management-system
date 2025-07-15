// ✅ LocalStorage-based for now, can swap later
function loadOrderList(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveOrderList(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ✅ Order arrays
export let deliveryOrders = loadOrderList('deliveryOrders');
export let liveOrders = loadOrderList('liveOrders');
export let preOrders = loadOrderList('preOrders');
export let historyOrders = loadOrderList('historyOrders');
export let preOrderHistory = loadOrderList('preOrderHistory');

// ✅ One-time Dummy Data Generator
if (!localStorage.getItem('preOrders') || !localStorage.getItem('liveOrders')) {
  console.log("🧪 Adding dummy orders now");
  const randomTime = () => {
    const hour = Math.floor(Math.random() * 12) + 1;
    const minute = Math.floor(Math.random() * 60);
    const ampm = Math.random() > 0.5 ? 'AM' : 'PM';
    return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  for (let i = 1; i <= 20; i++) {
    liveOrders.push({
      name: `Customer ${i}`,
      orderNo: `#${i}`,
      price: `Rs.${Math.floor(Math.random() * 500) + 100}`,
      items: ["1x Item A", "2x Item B", "1x Item C"],
      placedAt: randomTime(),
    });

    const startHour = Math.floor(4 + Math.random() * 6);
    const endHour = startHour + 1;
    preOrders.push({
      name: `Customer ${i}`,
      orderNo: `#${i}`,
      price: `Rs.${Math.floor(Math.random() * 500) + 100}`,
      items: ["1x Item A", "2x Item B", "1x Item C"],
      placedAt: randomTime(),
      deliveryWindow: `${startHour}:00 PM - ${endHour}:00 PM`,
    });
  }

  saveOrderList('liveOrders', liveOrders);
  saveOrderList('preOrders', preOrders);
}

// ✅ Save all
export function persistOrders() {
  saveOrderList('liveOrders', liveOrders);
  saveOrderList('preOrders', preOrders);
  saveOrderList('historyOrders', historyOrders);
  saveOrderList('preOrderHistory', preOrderHistory);
  saveOrderList('deliveryOrders', deliveryOrders);
}

export function clearDeliveryOrders() {
  deliveryOrders.length = 0;
  saveOrderList('deliveryOrders', deliveryOrders);
  console.log("✅ deliveryOrders cleared.");
}

function setupOrderDropdowns() {
  document.querySelectorAll('.dropdown-arrow').forEach(arrow => {
    arrow.addEventListener('click', () => {
      const details = arrow.parentElement.nextElementSibling;
      const isVisible = details.style.display === 'block';
      details.style.display = isVisible ? 'none' : 'block';
      arrow.classList.toggle('fa-chevron-down');
      arrow.classList.toggle('fa-chevron-up');
    });
  });
}

export function setupDeliveredButtons(type) {
  const selector = type === 'live' ? '.live-delivered' : '.pre-delivered';
  document.querySelectorAll(selector).forEach(btn => {
    btn.addEventListener('click', () => {
      const orderNo = btn.dataset.order;
      const list = type === 'live' ? liveOrders : preOrders;
      const history = type === 'live' ? historyOrders : preOrderHistory;
      const index = list.findIndex(o => o.orderNo === orderNo);
      if (index !== -1) {
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner"></span> Sending...`;

        const card = btn.closest(".live-order-card");
        if (card) {
          card.classList.add("order-card-exit");
          card.addEventListener("animationend", () => {
            history.push(list[index]);
            list.splice(index, 1);
            persistOrders();
            type === 'live' ? renderLiveOrders() : renderPreOrders();
          });
        }
      }
    });
  });
}

export function setupReadyButtons(type) {
  const selector = type === 'live' ? '.btn-ready:not(.used)' : '.btn-ready:not(.used)';
  document.querySelectorAll(selector).forEach(btn => {
    btn.addEventListener('click', () => {
      const orderNo = btn.dataset.order;
      const sourceList = type === 'live' ? liveOrders : preOrders;

      btn.disabled = true; // still disable to prevent double-click
      const card = btn.closest(".live-order-card");
      card.classList.add("order-card-exit");

      card.addEventListener("animationend", () => {
        const index = sourceList.findIndex(o => o.orderNo === orderNo);
        if (index !== -1) {
          const order = sourceList[index];
          deliveryOrders.push(order);
          sourceList.splice(index, 1);
          persistOrders();
          card.remove(); // ✅ Just remove the one card
        }
      });
    });
  });
}



function setupDeliveredFromDelivery() {
  document.querySelectorAll('.delivery-delivered').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderNo = btn.dataset.order;
      btn.disabled = true;

      const card = btn.closest(".live-order-card");
      card.classList.add("order-card-exit");

      card.addEventListener("animationend", () => {
        const index = deliveryOrders.findIndex(o => o.orderNo === orderNo);
        if (index !== -1) {
          const order = deliveryOrders[index];
          historyOrders.push(order);
          deliveryOrders.splice(index, 1);
          persistOrders();
          card.remove(); // ✅ Only the clicked one
        }
      });
    });
  });
}


export function renderLiveOrders() {
  const contentBox = document.getElementById('content-box');
  contentBox.className = 'content-box';
  contentBox.style.display = 'flex';
  contentBox.style.flexDirection = 'column';
  contentBox.style.alignItems = 'center';
  contentBox.style.height = 'calc(100vh - 10vh - 20px)';
  contentBox.style.padding = '10px';

  const html = liveOrders.map(order => `
    <div class="live-order-card fade-in">
      <div class="live-order-header">
        <span><strong>${order.name}</strong></span>
        <span><strong>Order ${order.orderNo}</strong></span>
        <span><strong>${order.price}</strong></span>
        <span class="btn-ready" data-order="${order.orderNo}">MARK AS READY</span>
        <i class="fas fa-chevron-down dropdown-arrow"></i>
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
  setupReadyButtons('live');
}

export function renderPreOrders() {
  const contentBox = document.getElementById('content-box');
  contentBox.className = 'content-box';
  contentBox.style.display = 'flex';
  contentBox.style.flexDirection = 'column';
  contentBox.style.alignItems = 'center';
  contentBox.style.height = 'calc(100vh - 10vh - 20px)';
  contentBox.style.padding = '10px';

  const html = preOrders.map(order => `
    <div class="live-order-card fade-in">
      <div class="live-order-header">
        <span><strong>${order.name}</strong></span>
        <span><strong>Order ${order.orderNo}</strong></span>
        <span><strong>${order.price}</strong></span>
        <span class="btn-ready" data-order="${order.orderNo}">MARK AS READY</span>
        <i class="fas fa-chevron-down dropdown-arrow"></i>
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
  setupReadyButtons('pre');
}

export function renderDeliveryManagement() {
  const contentBox = document.getElementById('content-box');
  contentBox.className = 'content-box';
  contentBox.innerHTML = `
    <div class="live-orders-container">
      <h2>🚚 Delivery Orders</h2>
      ${deliveryOrders.map(order => `
        <div class="live-order-card fade-in">
          <div class="live-order-header">
            <span><strong>${order.name}</strong></span>
            <span><strong>${order.orderNo}</strong></span>
            <span><strong>${order.price}</strong></span>
            <span class="btn-delivered delivery-delivered" data-order="${order.orderNo}">DELIVERED</span>
          </div>
          <div class="live-order-items">
            ${Array.isArray(order.items) ? order.items.join('<br>') : 'No items'}
          </div>
        </div>
      `).join('') || "<p>No delivery orders yet.</p>"}
    </div>
  `;
  setupDeliveredFromDelivery();
}
