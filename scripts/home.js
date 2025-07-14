import {
  liveOrders,
  preOrders,
  historyOrders,
  preOrderHistory,
} from "./orders.js";

import { menuItems } from "./menu.js";
const tips = [
  "Prep your sauces in bulk — it saves 30 minutes daily!",
  "Keep knives sharp — it's safer and faster.",
  "Clean as you go to avoid clutter.",
  "Use timers for every station to avoid delays.",
  "Label everything in storage — reduces waste."
];
const tip = tips[Math.floor(Math.random() * tips.length)];

export function renderHome() {
  // ✅ Set body class for home-specific CSS
  document.body.classList.add("home-page");
  document.body.classList.remove("other-page");

  // ✅ Remove old profile wrapper if exists
  const previousWrapper = document.querySelector(".profile-wrapper");
  if (previousWrapper) previousWrapper.remove();

  // ✅ Inject profile section in heading-box
  const headingBox = document.querySelector(".heading-box");
  const profileWrapper = document.createElement("div");
  profileWrapper.className = "profile-wrapper";
  const profilePic = localStorage.getItem("profilePic") || "assets/canteen.webp";
  profileWrapper.innerHTML = `
    <img id="top-profile-pic" class="top-profile-pic" src="${profilePic}" alt="Profile" />
    <div id="profile-dropdown" class="profile-dropdown hidden">
      <div class="dropdown-item" id="view-profile"> View Profile</div>
      <div class="dropdown-item" id="logout-btn"> Logout</div>
    </div>
  `;
  if (headingBox) headingBox.appendChild(profileWrapper);

  // ✅ Setup profile dropdown toggle
  document.getElementById("top-profile-pic").addEventListener("click", () => {
    document.getElementById("profile-dropdown").classList.toggle("show");
  });
  // ✅ Close dropdown if clicking outside
document.addEventListener("click", function (e) {
  const dropdown = document.getElementById("profile-dropdown");
  const profilePic = document.getElementById("top-profile-pic");

  if (
    dropdown.classList.contains("show") &&
    !dropdown.contains(e.target) &&
    !profilePic.contains(e.target)
  ) {
    dropdown.classList.remove("show");
  }
});


  // ✅ Logout
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    location.reload();
  });

  // ✅ View profile modal
  document.getElementById("view-profile").addEventListener("click", () => {
  document.getElementById("profile-dropdown").classList.add("hidden");

  const name = localStorage.getItem("profileName") || "Chetan Jain";
  const email = localStorage.getItem("profileEmail") || "chef@example.com";
  const role = localStorage.getItem("profileRole") || "Kitchen Admin";
  const pic = localStorage.getItem("profilePic") || "assets/canteen.webp";

  const modalRoot = document.getElementById("modal-root");
  modalRoot.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-box-styled">
        <button class="modal-close-styled">×</button>
        <h3> My Profile</h3>

        <div class="profile-form">
          <div class="profile-pic-wrapper">
            <img id="profile-pic-preview" src="${pic}" alt="Profile Pic" />
            <input type="file" id="profile-pic-upload" accept="image/*" />
          </div>

          <label>Name:</label>
          <input type="text" id="profile-name" value="${name}" class="input-styled" />

          <label>Email:</label>
          <input type="email" id="profile-email" value="${email}" class="input-styled" />

          <label>Role:</label>
          <input type="text" id="profile-role" value="${role}" class="input-styled" />

          <button class="primary-btn" id="save-profile"> Save</button>
        </div>
      </div>
    </div>
  `;
  // Close when clicking outside the modal box
document.querySelector(".modal-overlay").addEventListener("click", (e) => {
  const box = document.querySelector(".modal-box-styled");
  if (!box.contains(e.target)) {
    modalRoot.innerHTML = "";
  }
});


  // Close modal
  modalRoot.querySelector(".modal-close-styled").addEventListener("click", () => {
    modalRoot.innerHTML = "";
  });

  // Save data to localStorage
  document.getElementById("save-profile").addEventListener("click", () => {
    localStorage.setItem("profileName", document.getElementById("profile-name").value);
    localStorage.setItem("profileEmail", document.getElementById("profile-email").value);
    localStorage.setItem("profileRole", document.getElementById("profile-role").value);
    alert("✅ Profile saved!");
  });

  // Profile pic preview + save
  document.getElementById("profile-pic-upload").addEventListener("change", function (e) {
    const reader = new FileReader();
    reader.onload = function () {
      document.getElementById("profile-pic-preview").src = reader.result;
      localStorage.setItem("profilePic", reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  });
});


  // ✅ Dashboard data
  const availableItems = menuItems.filter((item) => item.available).length;
  const unavailableItems = menuItems.filter((item) => !item.available).length;

  // ✅ Prepare content-box
  const contentBox = document.getElementById("content-box");

  // 🔥 FIX: Reset styles and classes to avoid expanded layout bug
  contentBox.className = "content-box dashboard-view";
  contentBox.removeAttribute("style");

  // ✅ Inject dashboard UI
    contentBox.innerHTML = `
    <div class="dashboard-welcome">
      <h2>👋 Welcome back, Chef!</h2>
    </div>
   

    <div class="dashboard-grid">
      <div class="dashboard-card green">
        <i class="fas fa-fire"></i>
        <h3>Live Orders</h3>
        <p>${liveOrders.length}</p>
      </div>
      <div class="dashboard-card yellow">
        <i class="fas fa-clock"></i>
        <h3>Pre Orders</h3>
        <p>${preOrders.length}</p>
      </div>
      <div class="dashboard-card gray">
        <i class="fas fa-history"></i>
        <h3>History Orders</h3>
        <p>${historyOrders.length}</p>
      </div>
      <div class="dashboard-card red">
        <i class="fas fa-calendar-check"></i>
        <h3>Pre-Order History</h3>
        <p>${preOrderHistory.length}</p>
      </div>
      <div class="dashboard-card blue">
        <i class="fas fa-check-circle"></i>
        <h3>Available Menu Items</h3>
        <p>${availableItems}</p>
      </div>
      <div class="dashboard-card orange">
        <i class="fas fa-times-circle"></i>
        <h3>Unavailable Items</h3>
        <p>${unavailableItems}</p>
      </div>
        <div class="dashboard-tip">
    🍽️ <strong>Tip of the Day:</strong> "${tip}"
  </div>
    </div>
  `;

}
