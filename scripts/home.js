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

  const previousWrapper = document.querySelector(".profile-wrapper");
  if (previousWrapper) previousWrapper.remove();

  const headingBox = document.querySelector(".heading-box");
  const profileWrapper = document.createElement("div");
  profileWrapper.className = "profile-wrapper";
  profileWrapper.innerHTML = `
    <img id="top-profile-pic" class="top-profile-pic" src="assets/canteen.webp" alt="Profile" />
    <div class="profile-dropdown" id="profile-dropdown">
      <div class="dropdown-item" id="view-profile">View Profile</div>
      <div class="dropdown-item" id="logout-btn">Logout</div>
    </div>
  `;
  if (headingBox) headingBox.appendChild(profileWrapper);

  // ✅ Fetch latest profile pic from backend
  const token = localStorage.getItem("authToken");
  if (token) {
    fetch("http://192.168.213.174:8000/api/user/profile/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.profile_picture) {
          const topProfilePic = document.getElementById("top-profile-pic");
          if (topProfilePic) topProfilePic.src = data.profile_picture;
        }
      })
      .catch(err => {
        console.warn("Failed to load profile pic:", err);
      });
  }

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

  // ✅ LOGOUT HANDLER
  document.getElementById("logout-btn").addEventListener("click", async () => {
    if (!token) {
      showToast("⚠ You're already logged out", "warning");
      return;
    }

    try {
      const res = await fetch("http://192.168.213.174:8000/api/auth/logout/", {
        method: "POST",
        headers: {
          "Authorization": `Token ${token}`
        }
      });

      if (res.ok) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("isLoggedIn");
        location.reload();
      } else {
        const data = await res.json();
        console.error("Logout failed:", data);
        showToast("❌ Logout failed", "error");
      }
    } catch (err) {
      console.error("Logout error:", err);
      showToast("❌ Logout error", "error");
    }
  });

  // ✅ PROFILE VIEW + UPDATE
  document.getElementById("view-profile").addEventListener("click", async () => {
    dropdown.classList.remove("show");

    if (!token) {
      showToast("⚠ You are not logged in", "warning");
      return;
    }

    try {
      const res = await fetch("http://192.168.213.174:8000/api/user/profile/", {
        headers: { Authorization: `Token ${token}` },
      });

      if (!res.ok) throw new Error("Profile fetch failed");
      const data = await res.json();

      const modalRoot = document.getElementById("modal-root");
      modalRoot.innerHTML = `
        <div class="modal-overlay">
          <div class="profile-modal">
            <button class="modal-close-styled">×</button>
            <h2 class="modal-title">My Profile</h2>

            <div class="profile-pic-section">
              <img src="${data.profile_picture || 'assets/canteen.webp'}" alt="Profile Picture" class="profile-pic-preview" id="profile-pic-preview"/>
              <input type="file" id="profile-pic-input" accept="image/*" style="display:none;" />
            </div>

            <div class="profile-form">
              <label>Name:</label>
              <input type="text" id="profile-name" value="${data.name || ''}" />

              <label>Email:</label>
              <input type="email" id="profile-email" value="${data.email || ''}" disabled />

              <label>Phone:</label>
              <input type="text" id="profile-phone" value="${data.phone_number || ''}" />

              <label>DOB:</label>
              <input type="date" id="profile-dob" value="${data.dob || ''}" />

              <button class="profile-save-btn" id="save-profile-btn">Save</button>
            </div>
          </div>
        </div>
      `;

      // 🔁 Close modal events
      modalRoot.querySelector(".modal-close-styled").addEventListener("click", () => {
        modalRoot.innerHTML = "";
      });
      modalRoot.querySelector(".modal-overlay").addEventListener("click", (e) => {
        if (e.target.classList.contains("modal-overlay")) {
          modalRoot.innerHTML = "";
        }
      });

      // ✅ Preview image click = open file input
      document.getElementById("profile-pic-preview").addEventListener("click", () => {
        document.getElementById("profile-pic-input").click();
      });

      // 🔍 Show selected image
      document.getElementById("profile-pic-input").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          document.getElementById("profile-pic-preview").src = URL.createObjectURL(file);
        }
      });

      // 💾 Save profile
      document.getElementById("save-profile-btn").addEventListener("click", async () => {
        const name = document.getElementById("profile-name").value.trim();
        const phone = document.getElementById("profile-phone").value.trim();
        const dob = document.getElementById("profile-dob").value;
        const file = document.getElementById("profile-pic-input").files[0];

        const formData = new FormData();
        formData.append("name", name);
        formData.append("phone_number", phone);
        formData.append("dob", dob);
        if (file) formData.append("profile_picture", file);

        try {
          const res = await fetch("http://192.168.213.174:8000/api/user/profile/update/", {
            method: "PUT",
            headers: {
              Authorization: `Token ${token}`,
            },
            body: formData,
          });

          if (!res.ok) throw new Error("Update failed");

          // ✅ Update top profile pic immediately
          if (file) {
            const updatedUrl = URL.createObjectURL(file);
            const topProfilePic = document.getElementById("top-profile-pic");
            if (topProfilePic) topProfilePic.src = updatedUrl;
          }

          showToast("✅ Profile updated successfully!");
          modalRoot.innerHTML = "";
        } catch (err) {
          console.error("Profile update failed:", err);
          showToast("❌ Failed to update profile", "error");
        }
      });
    } catch (err) {
      console.error("Profile load failed:", err);
      showToast("❌ Unable to load profile", "error");
    }
  });

  // 📊 DASHBOARD
  const availableItems = menuItems.filter((item) => item.available).length;
  const unavailableItems = menuItems.filter((item) => !item.available).length;

  const contentBox = document.getElementById("content-box");
  if (!contentBox) return;
  contentBox.className = "content-box dashboard-view";
  contentBox.removeAttribute("style");

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
      <div class="dashboard-tip">🍽 <strong>Tip of the Day:</strong> "${tip}"</div>
    </div>
  `;

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
