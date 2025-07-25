import {
  liveOrders,
  preOrders,
  historyOrders,
  preOrderHistory,
} from "./orders.js";

import { menuItems } from "./menu.js";
import { showToast } from './popup.js';

const tips = [
  "Prep your sauces in bulk — it saves 30 minutes daily!",
  "Keep knives sharp — it's safer and faster.",
  "Clean as you go to avoid clutter.",
  "Use timers for every station to avoid delays.",
  "Label everything in storage — reduces waste."
];
const tip = tips[Math.floor(Math.random() * tips.length)];

export function renderHome() {
  document.body.classList.add("home-page");
  document.body.classList.remove("other-page");

  // ✅ Clean up old profile wrapper if exists
  const previousWrapper = document.querySelector(".profile-wrapper");
  if (previousWrapper) previousWrapper.remove();

  // ✅ Re-insert profile
  const headingBox = document.querySelector(".heading-box");
  const profileWrapper = document.createElement("div");
  profileWrapper.className = "profile-wrapper";
  profileWrapper.innerHTML = `
    <img id="top-profile-pic" class="top-profile-pic" src="assets/canteen.webp" alt="Profile" />
    <div id="profile-dropdown" class="profile-dropdown">
      <div class="dropdown-item" id="view-profile">View Profile</div>
      <div class="dropdown-item" id="logout-btn">Logout</div>
    </div>
  `;
  if (headingBox) headingBox.appendChild(profileWrapper);

  // ✅ Dropdown toggle
  const profilePic = document.getElementById("top-profile-pic");
  const dropdown = document.getElementById("profile-dropdown");

  profilePic.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && !profilePic.contains(e.target)) {
      dropdown.classList.remove("show");
    }
  });

  // ✅ Logout button
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    location.reload();
  });

  // ✅ View profile logic
  document.getElementById("view-profile").addEventListener("click", () => {
    dropdown.classList.remove("show");

    const storedProfile = JSON.parse(localStorage.getItem("profileData")) || {};
    const nameValue = storedProfile.name || "Chetan Jain";
    const emailValue = storedProfile.email || "chef@example.com";
    const roleValue = storedProfile.role || "Kitchen Admin";

    const modalRoot = document.getElementById("modal-root");
    modalRoot.innerHTML = `
      <div class="modal-overlay">
        <div class="profile-modal">
          <button class="modal-close-styled">×</button>
          <h2 class="modal-title">My Profile</h2>

          <div class="profile-pic-section">
            <img src="assets/canteen.webp" alt="Profile Picture" class="profile-pic-preview" id="profile-pic-preview"/>
            <input type="file" id="profile-pic-input" accept="image/*" />
          </div>

          <div class="profile-form">
            <label>Name:</label>
            <input type="text" id="profile-name" value="${nameValue}" />

            <label>Email:</label>
            <input type="email" id="profile-email" value="${emailValue}" />

            <label>Role:</label>
            <input type="text" id="profile-role" value="${roleValue}" />

            <button class="profile-save-btn" id="save-profile-btn">Save</button>
          </div>
        </div>
      </div>
    `;

    modalRoot.querySelector(".modal-close-styled").addEventListener("click", () => {
      modalRoot.innerHTML = "";
    });

    modalRoot.querySelector(".modal-overlay").addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-overlay")) {
        modalRoot.innerHTML = "";
      }
    });

    document.getElementById("profile-pic-input").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        document.getElementById("profile-pic-preview").src = URL.createObjectURL(file);
      }
    });

    document.getElementById("save-profile-btn").addEventListener("click", () => {
      const name = document.getElementById("profile-name").value.trim();
      const email = document.getElementById("profile-email").value.trim();
      const role = document.getElementById("profile-role").value.trim();

      if (!name || !email || !role) {
        alert("Please fill in all fields.");
        return;
      }

      localStorage.setItem("profileData", JSON.stringify({ name, email, role }));
      showToast("✅ Profile updated successfully!");
      modalRoot.innerHTML = "";
    });
  });

  // ✅ Render dashboard cards
  const contentBox = document.getElementById("content-box");
  if (!contentBox) {
    console.error("❌ #content-box missing. Cannot render dashboard.");
    return;
  }

  contentBox.className = "content-box dashboard-view";
  contentBox.removeAttribute("style");

  const availableItems = menuItems.filter((item) => item.available).length;
  const unavailableItems = menuItems.filter((item) => !item.available).length;

  contentBox.innerHTML = `
    <div class="dashboard-welcome">
      <h2>👋 Welcome back, Chef!</h2>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-card green"><h3>Live Orders</h3><p>${liveOrders.length}</p></div>
      <div class="dashboard-card yellow"><h3>Pre Orders</h3><p>${preOrders.length}</p></div>
      <div class="dashboard-card gray"><h3>History Orders</h3><p>${historyOrders.length}</p></div>
      <div class="dashboard-card red"><h3>Pre-Order History</h3><p>${preOrderHistory.length}</p></div>
      <div class="dashboard-card blue"><h3>Available Menu Items</h3><p>${availableItems}</p></div>
      <div class="dashboard-card orange"><h3>Unavailable Items</h3><p>${unavailableItems}</p></div>
      <div class="dashboard-tip">🍽️ <strong>Tip of the Day:</strong> "${tip}"</div>
    </div>
  `;

  // ✅ Add click navigation to cards
  document.querySelectorAll(".dashboard-card").forEach((card) => {
    const title = card.querySelector("h3")?.textContent?.toLowerCase();
    let targetPage = null;

    switch (title) {
      case "live orders": targetPage = "liveOrder"; break;
      case "pre orders": targetPage = "preOrder"; break;
      case "history orders":
      case "pre-order history": targetPage = "history"; break;
      case "available menu items":
      case "unavailable items": targetPage = "menu"; break;
    }

    if (targetPage) {
      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        document.querySelector(`.nav-item[data-page="${targetPage}"]`)?.click();
      });
    }
  });
}
