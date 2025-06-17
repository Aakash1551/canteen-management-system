// history.js
import { historyOrders, preOrderHistory } from './orders.js';

export function renderHistory() {
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

  document.getElementById('content-box').innerHTML = `
    <div class="live-orders-container">
      <h3>Live Order History</h3>
      ${liveHtml || "<p>No live order history</p>"}
      <h3>Pre-Order History</h3>
      ${preHtml || "<p>No pre-order history</p>"}
    </div>
  `;
}
