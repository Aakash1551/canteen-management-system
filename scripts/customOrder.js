import { loadMenuItems } from './menu.js';
import { liveOrders, preOrders, renderLiveOrders, renderPreOrders } from './orders.js';
import { persistOrders } from './orders.js';

let customCart = [];

export function renderCustomOrderPage() {
  customCart = [];

  document.getElementById('content-box').innerHTML = `
    <div class="custom-order-wrapper">
      <h2>New Order</h2>
      
      <div class="order-mode">
        <label><input type="radio" name="userType" value="guest" checked /> Guest Order</label>
        <label><input type="radio" name="userType" value="customer" /> Customer Order</label>
      </div>

      <div id="customerSection" style="display:none; margin-top: 10px;">
        <input id="custID" class="input-styled" placeholder="Enter Customer ID"/>
        <div class="order-type">
          <label><input type="radio" name="orderType" value="live" checked /> Live Order</label>
          <label><input type="radio" name="orderType" value="pre" /> Pre-Order</label>
        </div>
      </div>

      <button id="nextToMenu" class="primary-btn">Next</button>
    </div>
  `;

  document.querySelectorAll('input[name="userType"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const userType = document.querySelector('input[name="userType"]:checked').value;
      document.getElementById('customerSection').style.display = userType === 'customer' ? 'block' : 'none';
    });
  });

  document.getElementById('nextToMenu').addEventListener('click', () => {
    const userType = document.querySelector('input[name="userType"]:checked').value;

    if (userType === 'customer') {
      const custID = document.getElementById('custID').value.trim();
      if (!custID) {
        alert("Please enter Customer ID");
        return;
      }
      const orderType = document.querySelector('input[name="orderType"]:checked').value;
      renderCustomOrderMenu(orderType, custID, 'customer');
    } else {
      renderCustomOrderMenu('guest', 'Guest', 'guest');
    }
  });
}

function renderCustomOrderMenu(orderType, customerId, userType) {
  loadMenuItems();
  const items = JSON.parse(localStorage.getItem('menuItems')) || [];

  document.getElementById('content-box').innerHTML = `
    <div style="margin-bottom:10px; text-align:center;">
      <input id="customSearch" class="input-styled" placeholder="Search menu..." style="max-width:300px; width:100%;"/>
    </div>
    <div id="customContainer" style="max-width:700px; width:100%; margin:auto;">
      <div id="customMenuArea"></div>
    </div>
    <div class="cart-summary">
      <span id="cart-count">Items: 0</span>
      <button id="confirmCustom" class="primary-btn">Confirm Order</button>
    </div>
  `;

  document.getElementById('customSearch').addEventListener('input', e => {
    const search = e.target.value.toLowerCase();
    renderMenuItems(items, search);
  });

  document.getElementById('confirmCustom').addEventListener('click', () => {
    if (customCart.length === 0) {
      alert("Add at least 1 item to cart");
      return;
    }

    const order = {
      name: userType === 'guest' ? 'Guest Customer' : `Custom Customer ${customerId}`,
      orderNo: `#${Math.floor(Math.random() * 100000)}`,
      price: 'Custom',
      items: customCart.map(i => `${i.qty}x ${i.name} (${i.price})`),
      placedAt: new Date().toLocaleTimeString(),
      deliveryWindow: null,
      source: userType === 'guest' ? 'Guest Order' : `Custom Order (ID: ${customerId})`
    };

    showOrderSummaryModal(order, orderType, userType);
  });

  renderMenuItems(items, '');
}

function renderMenuItems(items, search) {
  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search) || i.category.toLowerCase().includes(search)
  );

  let html = '';
  const grouped = {};

  filtered.forEach(i => {
    if (!grouped[i.category]) grouped[i.category] = [];
    grouped[i.category].push(i);
  });

  for (const cat in grouped) {
    html += `<h3>${cat}</h3>`;
    grouped[cat].forEach(i => {
      const isAdded = customCart.find(c => c.name === i.name);
      html += `
        <div class="menu-card-fixed">
          <div class="menu-info">${i.name} - ${i.price}</div>
          <div class="qty-controls" data-name="${i.name}" data-price="${i.price}">
            ${isAdded ? `
              <button class="qty-decrease">-</button>
              <span class="qty-number">${isAdded.qty}</span>
              <button class="qty-increase">+</button>
            ` : `
              <button class="qty-increase">Add</button>
            `}
          </div>
        </div>
      `;
    });
  }

  document.getElementById('customMenuArea').innerHTML = html;

  document.querySelectorAll('.qty-controls').forEach(ctrl => {
    const name = ctrl.dataset.name;
    const price = ctrl.dataset.price;

    ctrl.querySelectorAll('.qty-increase').forEach(btn => {
      btn.addEventListener('click', () => {
        let item = customCart.find(c => c.name === name);
        if (item) {
          item.qty++;
        } else {
          customCart.push({ name, price, qty: 1 });
        }
        updateCartSummary();
        renderMenuItems(items, document.getElementById('customSearch').value.toLowerCase());
      });
    });

    ctrl.querySelectorAll('.qty-decrease').forEach(btn => {
      btn.addEventListener('click', () => {
        let index = customCart.findIndex(c => c.name === name);
        if (index > -1) {
          customCart[index].qty--;
          if (customCart[index].qty <= 0) {
            customCart.splice(index, 1);
          }
        }
        updateCartSummary();
        renderMenuItems(items, document.getElementById('customSearch').value.toLowerCase());
      });
    });
  });

  updateCartSummary();
}

function updateCartSummary() {
  const totalItems = customCart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById('cart-count').textContent = `Items: ${totalItems}`;
}

function showOrderSummaryModal(order, orderType, userType = 'customer') {
  const modalRoot = document.getElementById('modal-root') || (() => {
    const div = document.createElement('div');
    div.id = 'modal-root';
    document.body.appendChild(div);
    return div;
  })();

  let deliverySlotHTML = '';
  if (orderType === 'pre') {
    deliverySlotHTML = `
      <div style="margin:10px 0;">
        <label for="slotInput">Select Delivery Slot:</label>
        <input id="slotInput" class="input-styled" placeholder="e.g. 6 PM - 7 PM" style="width:100%; margin-top:5px;">
      </div>
    `;
  }

  modalRoot.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-box-styled">
        <button class="modal-close-styled">X</button>
        <h3>Order Summary</h3>
        <div style="text-align:left; margin: 10px 0;">
          ${order.items.map(i => `<div>${i}</div>`).join('')}
        </div>
        ${deliverySlotHTML}
        <div style="margin-top: 15px; display: flex; justify-content: space-between;">
          <button id="confirmOrderBtn" class="primary-btn">Confirm</button>
          <button id="cancelOrderBtn" class="primary-btn" style="background:#dc3545;">Cancel</button>
        </div>
      </div>
    </div>
  `;

  document.body.style.overflow = 'hidden';

  modalRoot.querySelector('.modal-close-styled').addEventListener('click', () => {
    modalRoot.innerHTML = '';
    document.body.style.overflow = '';
  });

  modalRoot.querySelector('#cancelOrderBtn').addEventListener('click', () => {
    modalRoot.innerHTML = '';
    document.body.style.overflow = '';
  });

  modalRoot.querySelector('#confirmOrderBtn').addEventListener('click', () => {
    if (orderType === 'pre') {
      const slot = document.getElementById('slotInput').value.trim();
      if (!slot) {
        alert('Please enter a delivery slot');
        return;
      }
      order.deliveryWindow = slot;
    }

    if (userType === 'guest') {
      renderGuestPaymentScanner(order);
    } else {
      modalRoot.innerHTML = ''; // Only close modal for customer flow
      document.body.style.overflow = '';
      simulateCustomerNotification(order, orderType);
    }
  });
}

function renderGuestPaymentScanner(order) {
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-box-styled">
        <h3>Scan to Pay</h3>
        <div style="margin: 20px 0;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?data=Pay+Cafe+Order&size=180x180" alt="QR Code"/>
          <p style="margin-top:10px;">Scan the QR code above to pay</p>
        </div>
        <button id="donePaymentBtn" class="primary-btn">Payment Done</button>
      </div>
    </div>
  `;

  document.body.style.overflow = 'hidden';

  document.getElementById('donePaymentBtn').addEventListener('click', () => {
    liveOrders.push(order);
    // renderLiveOrders();
    renderCustomOrderPage()
    persistOrders();
    modalRoot.innerHTML = '';
    document.body.style.overflow = '';
  });
}

function simulateCustomerNotification(order, type) {
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-box-styled">
        <h3>Waiting for Payment</h3>
        <p>Order sent to app. Waiting for customer to complete payment...</p>
        <button id="simulatePaymentBtn" class="primary-btn" style="margin-top: 20px;">Simulate Payment Success</button>
      </div>
    </div>
  `;

  modalRoot.querySelector('#simulatePaymentBtn').addEventListener('click', () => {
    if (type === 'live') {
      liveOrders.push(order);
      // renderLiveOrders();
      renderCustomOrderPage()
    } else {
      preOrders.push(order);
      // renderPreOrders();
      renderCustomOrderPage()
    }
    persistOrders();
    modalRoot.innerHTML = '';
  });
}
