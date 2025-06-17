// customOrder.js — FINAL with Pre-Order slot input in summary modal
import { loadMenuItems } from './menu.js';
import { liveOrders, preOrders, renderLiveOrders, renderPreOrders } from './orders.js';

let customCart = [];

function injectCustomStyles() {
  if (document.getElementById('custom-order-styles')) return;

  const style = document.createElement('style');
  style.id = 'custom-order-styles';
  style.textContent = `
    .menu-card-fixed { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 10px; width: 100%; max-width: 700px; gap: 10px; }
    .menu-info { font-weight: bold; font-size: 16px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex-grow: 1; }
    .qty-controls { display: flex; align-items: center; gap: 6px; }
    .qty-controls button { padding: 4px 10px; border: none; border-radius: 4px; background: #007bff; color: #fff; cursor: pointer; }
    .qty-controls .qty-number { min-width: 20px; text-align: center; font-weight: bold; }
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 999; }
    .modal-box-styled { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); max-width: 400px; width: 90%; position: relative; }
    .modal-close-styled { position: absolute; top: 8px; right: 12px; background: none; border: none; font-size: 20px; cursor: pointer; }
  `;
  document.head.appendChild(style);
}

export function renderCustomOrderPage() {
  injectCustomStyles();
  customCart = [];

  document.getElementById('content-box').innerHTML = `
    <div class="custom-order-wrapper">
      <h2>Custom Order</h2>
      <input id="custID" class="input-styled" placeholder="Enter Customer ID"/>
      <div class="order-type">
        <label><input type="radio" name="orderType" value="live" checked /> Live Order</label>
        <label><input type="radio" name="orderType" value="pre" /> Pre-Order</label>
      </div>
      <button id="nextToMenu" class="primary-btn">Next</button>
    </div>
  `;

  document.getElementById('nextToMenu').addEventListener('click', () => {
    const custID = document.getElementById('custID').value.trim();
    if (!custID) {
      alert("Please enter Customer ID");
      return;
    }
    const orderType = document.querySelector('input[name="orderType"]:checked').value;
    renderCustomOrderMenu(orderType, custID);
  });
}

function renderCustomOrderMenu(orderType, customerId) {
  injectCustomStyles();
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
      name: `Custom Customer ${customerId}`,
      orderNo: `#${Math.floor(Math.random() * 100000)}`,
      price: 'Custom',
      items: customCart.map(i => `${i.qty}x ${i.name} (${i.price})`),
      placedAt: new Date().toLocaleTimeString(),
      deliveryWindow: null,
      source: `Custom Order (ID: ${customerId})`
    };

    showOrderSummaryModal(order, orderType);
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

function showOrderSummaryModal(order, orderType) {
  const modalRoot = document.getElementById('modal-root') || (() => {
    const div = document.createElement('div');
    div.id = 'modal-root';
    document.body.appendChild(div);
    return div;
  })();

  modalRoot.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-box-styled">
        <button class="modal-close-styled">X</button>
        <h3>Order Summary</h3>
        <div style="text-align:left; margin: 10px 0;">
          ${order.items.map(i => `<div>${i}</div>`).join('')}
        </div>
        ${orderType === 'pre' ? `
          <div style="margin:10px 0;">
            <label for="slotInput">Select Delivery Slot:</label>
            <input id="slotInput" class="input-styled" placeholder="e.g. 6 PM - 7 PM" style="width:100%; margin-top:5px;">
          </div>
        ` : ''}
        <div style="margin-top: 15px; display: flex; justify-content: space-between;">
          <button id="confirmOrderBtn" class="primary-btn">Confirm</button>
          <button id="cancelOrderBtn" class="primary-btn" style="background:#dc3545;">Cancel</button>
        </div>
      </div>
    </div>
  `;

  modalRoot.querySelector('.modal-close-styled').addEventListener('click', () => modalRoot.innerHTML = '');
  modalRoot.querySelector('#cancelOrderBtn').addEventListener('click', () => modalRoot.innerHTML = '');
  modalRoot.querySelector('#confirmOrderBtn').addEventListener('click', () => {
    if (orderType === 'pre') {
      const slot = document.getElementById('slotInput').value.trim();
      if (!slot) {
        alert('Please enter a delivery slot');
        return;
      }
      order.deliveryWindow = slot;
    }

    if (orderType === 'live') {
      liveOrders.push(order);
      renderLiveOrders();
    } else {
      preOrders.push(order);
      renderPreOrders();
    }
    alert('Order placed successfully!');
    modalRoot.innerHTML = '';
  });
}
