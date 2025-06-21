import {
  liveOrders,
  preOrders,
  historyOrders,
  preOrderHistory,
} from "./orders.js";

import { menuItems } from "./menu.js";

export function renderHome() {
  const availableItems = menuItems.filter((item) => item.available).length;
  const unavailableItems = menuItems.filter((item) => !item.available).length;

  const contentBox = document.getElementById("content-box");

  contentBox.innerHTML = `
  <div class="dashboard-welcome">
      <h2>👋 Welcome back, Chef!</h2>
    </div>
    <div class="dashboard-grid">
      <div class="dashboard-card green">
  <h3>Live Orders</h3><p>${liveOrders.length}</p>
</div>
<div class="dashboard-card yellow">
  <h3>Pre Orders</h3><p>${preOrders.length}</p>
</div>
<div class="dashboard-card gray">
  <h3>History Orders</h3><p>${historyOrders.length}</p>
</div>
<div class="dashboard-card red">
  <h3>Pre-Order History</h3><p>${preOrderHistory.length}</p>
</div>
<div class="dashboard-card blue">
  <h3>Available Menu Items</h3><p>${availableItems}</p>
</div>
<div class="dashboard-card orange">
  <h3>Unavailable Items</h3><p>${unavailableItems}</p>
</div>

    </div>
  `;

  contentBox.classList.add("dashboard-view");
}
