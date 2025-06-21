import {
  liveOrders,
  preOrders,
  historyOrders,
  preOrderHistory,
} from "./orders.js";

import { menuItems } from "./menu.js";

export function renderHome() {
  document.body.classList.add('home-page');
document.body.classList.remove('other-page');

  const previousWrapper = document.querySelector(".profile-wrapper");
  if (previousWrapper) previousWrapper.remove();

  // ✅ Inject into heading-box only when on Home
  const headingBox = document.querySelector(".heading-box");
  const profileWrapper = document.createElement("div");
  profileWrapper.className = "profile-wrapper";
  profileWrapper.innerHTML = `
    <img id="top-profile-pic" class="top-profile-pic" src="assets/canteen.webp" alt="Profile" />
    <div id="profile-dropdown" class="profile-dropdown hidden">
      <div class="dropdown-item" id="view-profile">👤 View Profile</div>
      <div class="dropdown-item" id="logout-btn">🔒 Logout</div>
    </div>
  `;
  if (headingBox) {
  headingBox.appendChild(profileWrapper);
}


  // Add event listeners
  document.getElementById("top-profile-pic").addEventListener("click", () => {
    document.getElementById("profile-dropdown").classList.toggle("show");
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    location.reload();
  });

 document.getElementById('view-profile').addEventListener('click', () => {
  document.getElementById('profile-dropdown').classList.add('hidden');

  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-box-styled">
        <button class="modal-close-styled">×</button>
        <h3>👤 My Profile</h3>
        <p><strong>Name:</strong> Chetan Jain</p>
        <p><strong>Email:</strong> chef@example.com</p>
        <p><strong>Role:</strong> Kitchen Admin</p>
      </div>
    </div>
  `;

  modalRoot.querySelector('.modal-close-styled').addEventListener('click', () => {
    modalRoot.innerHTML = '';
  });
});


  // Dashboard content
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
