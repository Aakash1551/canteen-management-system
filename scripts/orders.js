// orders.js - COMPLETE FILE
import { showToast } from './popup.js';

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

// ✅ One-time Dummy Data Generator (if localStorage is empty)
if (!localStorage.getItem('preOrders') || !localStorage.getItem('liveOrders')) {
  console.log("🧪 Adding dummy orders now");
  const randomTime = () => {
    const hour = Math.floor(Math.random() * 12) + 1;
    const minute = Math.floor(Math.random() * 60);
    const ampm = Math.random() > 0.5 ? 'AM' : 'PM';
    return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  liveOrders = []; // Clear existing for fresh dummy data
  preOrders = [];  // Clear existing for fresh dummy data

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

// ✅ Clear delivery only
export function clearDeliveryOrders() {
  deliveryOrders.length = 0;
  saveOrderList('deliveryOrders', deliveryOrders);
  console.log("✅ deliveryOrders cleared.");
}

// ✅ Toggle Dropdown
function setupOrderDropdowns() {
  document.querySelectorAll('.dropdown-arrow').forEach(arrow => {
    // Ensure only one event listener is attached per arrow
    const clonedArrow = arrow.cloneNode(true);
    arrow.parentNode.replaceChild(clonedArrow, arrow);

    clonedArrow.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent card click event if parent card has one
      const details = clonedArrow.closest('.live-order-card').querySelector('.live-order-details');
      const isVisible = details.style.display === 'block';
      details.style.display = isVisible ? 'none' : 'block';
      clonedArrow.classList.toggle('open', !isVisible);
      // Lucide icon change for arrow (chevron-down when closed, chevron-up when open)
      clonedArrow.innerHTML = isVisible ? '<i data-lucide="chevron-down"></i>' : '<i data-lucide="chevron-up"></i>';
      if (window.lucide) lucide.createIcons(); // Re-render icon
    });
  });
}


// ✅ Button: Delivered (for history)
export function setupDeliveredButtons(type) {
  const selector = type === 'live' ? '.live-delivered' : '.pre-delivered';
  document.querySelectorAll(selector).forEach(btn => {
    // Clone node to prevent duplicate listeners
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', () => {
      const orderNo = newBtn.dataset.order;
      const list = type === 'live' ? liveOrders : preOrders;
      const history = type === 'live' ? historyOrders : preOrderHistory;
      const index = list.findIndex(o => o.orderNo === orderNo);
      if (index !== -1) {
        history.push(list[index]);
        list.splice(index, 1);
        persistOrders();
        type === 'live' ? renderLiveOrders() : renderPreOrders();
      }
    });
  });
}

// ✅ Button: Mark as Ready (send to delivery) - NO SPINNER
export function setupReadyButtons(type) {
  const selector = type === 'live' ? '.btn-ready' : '.btn-ready';
  document.querySelectorAll(selector).forEach(btn => {
    // Clone node to remove all existing listeners safely before adding new one
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', () => {
      const orderNo = newBtn.dataset.order;
      const sourceList = type === 'live' ? liveOrders : preOrders;
      const index = sourceList.findIndex(o => o.orderNo === orderNo);

      if (index !== -1) {
        const order = sourceList[index];
        deliveryOrders.push(order); // Move order to delivery list
        sourceList.splice(index, 1); // Remove from source list
        persistOrders(); // Save changes to localStorage

        // Add the exit animation class
        const orderCard = newBtn.closest('.live-order-card');
        if (orderCard) {
          orderCard.classList.add('order-card-exit');
          orderCard.addEventListener('animationend', () => {
            orderCard.remove(); // Remove the card from DOM after animation
            // Re-render the list after animation for updated counts/layout
            if (type === 'live') {
              renderLiveOrders();
            } else {
              renderPreOrders();
            }
          });
        } else {
          // Fallback if animation doesn't work or card not found
          if (type === 'live') {
            renderLiveOrders();
          } else {
            renderPreOrders();
          }
        }
        showToast(`Order ${orderNo} marked as ready for delivery!`); // Show success toast
      }
    });
  });
}

function setupDeliveredFromDelivery() {
  document.querySelectorAll('.delivery-delivered').forEach(btn => {
    // Clone node to prevent duplicate listeners
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', () => {
      const orderNo = newBtn.dataset.order;
      const index = deliveryOrders.findIndex(o => o.orderNo === orderNo);
      if (index !== -1) {
        const order = deliveryOrders[index];
        historyOrders.push(order);              // ✅ Move to history
        deliveryOrders.splice(index, 1);        // ❌ Remove from delivery
        persistOrders();                        // 💾 Save
        renderDeliveryManagement();             // 🔄 Refresh UI
        showToast(`✅ Order ${orderNo} marked as delivered`);
      }
    });
  });
}


export function renderLiveOrders() {
  const contentBox = document.getElementById("content-box");
  if (!contentBox) return;

  contentBox.className = 'content-box';
  contentBox.style.display = 'flex';
  contentBox.style.flexDirection = 'column';
  contentBox.style.alignItems = 'center';
  contentBox.style.height = '';
  contentBox.style.padding = '';

  contentBox.innerHTML = `
    <div class="live-orders-table-wrapper">
      <div class="live-orders-header-row">
        <div><i data-lucide="users"></i><span>Customer</span></div>
        <div><i data-lucide="clipboard-list"></i><span>Order No.</span></div>
        <div><i data-lucide="dollar-sign"></i><span>Price</span></div>
        <div><span>Action</span></div>
      </div>
      <div class="live-orders-container" id="liveOrdersList"></div>
    </div>
  `;

  const liveOrdersListContainer = document.getElementById('liveOrdersList');

  const sortedLiveOrders = [...liveOrders].sort(
    (a, b) => parseInt(a.orderNo.replace('#', '')) - parseInt(b.orderNo.replace('#', ''))
  );

  const html = sortedLiveOrders.map(order => `
    <div class="live-order-card" data-order-no="${order.orderNo}">
      <div class="live-order-header">
        <div>${order.name}</div>
        <div>${order.orderNo}</div>
        <div>${order.price}</div>
        <div class="action-cell">
          <span class="btn-ready" data-order="${order.orderNo}">MARK AS READY</span>
          <span class="dropdown-arrow"><i data-lucide="chevron-down"></i></span>
        </div>
      </div>
      <div class="live-order-details" style="display: none;">
        ${order.items.join('<br>')}
        <div style="margin-top: 5px; font-size: 12px; color: #666;">
          Placed at: ${order.placedAt}
        </div>
      </div>
    </div>
  `).join('');

  liveOrdersListContainer.innerHTML = html || "<p style='text-align: center; width: 100%; margin-top: 20px;'>No live orders found.</p>";

  if (window.lucide) lucide.createIcons();

  setupOrderDropdowns();
  setupReadyButtons('live');
}



// ✅ Render: Pre Orders (Matching image_06d27b.png Design)
export function renderPreOrders() {
const contentBox = document.getElementById("content-box");
if (!contentBox) return;
  

  contentBox.className = 'content-box'; // Keep existing class for general layout
  contentBox.style.display = 'flex';
  contentBox.style.flexDirection = 'column';
  contentBox.style.alignItems = 'center';
  // Let CSS handle height and padding for this ID for ultimate control
  contentBox.style.height = '';
  contentBox.style.padding = '';

  // Header row for the order list, as seen in image_06d27b.png
 contentBox.innerHTML = `
  <div class="live-orders-table-wrapper">
    <div class="live-orders-header-row">
      <div><i data-lucide="users"></i><span>Customer</span></div>
      <div><i data-lucide="clipboard-list"></i><span>Order No.</span></div>
      <div><i data-lucide="dollar-sign"></i><span>Price</span></div>
      <div><span>Action</span></div>
    </div>
    <div class="live-orders-container" id="preOrdersList"></div>
  </div>
`;


  const preOrdersListContainer = document.getElementById('preOrdersList');

  // Sort by order number ascending by default for consistency with image
  const sortedPreOrders = [...preOrders].sort((a, b) => parseInt(a.orderNo.replace('#', '')) - parseInt(b.orderNo.replace('#', '')));

  const html = sortedPreOrders.map(order => `
  <div class="live-order-card" data-order-no="${order.orderNo}">
    <div class="live-order-header">
      <div>${order.name}</div>
      <div>${order.orderNo}</div>
      <div>${order.price}</div>
      <div class="action-cell">
        <span class="btn-ready" data-order="${order.orderNo}">MARK AS READY</span>
        <span class="dropdown-arrow"><i data-lucide="chevron-down"></i></span>
      </div>
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


  preOrdersListContainer.innerHTML = html || "<p style='text-align: center; width: 100%; margin-top: 20px;'>No pre-orders found.</p>";

  // Create Lucide icons for header and dropdown arrows
  // This needs to be called AFTER contentBox.innerHTML has been set
  if (window.lucide) lucide.createIcons();

  setupOrderDropdowns(); // Re-attach dropdown listeners
  setupReadyButtons('pre'); // Re-attach ready button listeners
}

// ✅ Render: Delivery Page
export function renderDeliveryManagement() {
  const contentBox = document.getElementById('content-box');
  contentBox.className = 'content-box'; // Ensure basic content-box styling
  contentBox.innerHTML = `
    <div class="live-orders-container">
      <h2>🚚 Delivery Orders</h2>
      ${deliveryOrders.map(order => `
        <div class="live-order-card">
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
  setupDeliveredFromDelivery(); // ✅ Activate delivery buttons
}