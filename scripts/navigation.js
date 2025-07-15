import {
  renderLiveOrders,
  renderPreOrders,
  liveOrders,
  preOrders,
  historyOrders,
  preOrderHistory,
  renderDeliveryManagement,
} from "./orders.js";

import { renderHome } from './home.js';
import { renderMenuManagement } from "./menu.js";
import { renderContactPage } from "./contact.js";
import { renderHistory } from "./history.js";
import { renderCustomOrderPage } from "./customOrder.js";
import { renderLoginPage, renderSignupPage, injectAuthStyles } from "./auth.js";
import { menuItems } from './menu.js';

const availableItems = menuItems.filter(item => item.available).length;
const unavailableItems = menuItems.filter(item => !item.available).length;

export function setupNavigation() {
  const contentBox = document.getElementById("content-box");
  const pageTitle = document.getElementById("page-title");
  const iconBox = document.getElementById("heading-icon");

  const icons = {
    home: "icons/home-black.svg",
    liveOrder: "icons/order-black.svg",
    preOrder: "icons/order-black.svg",
    history: "icons/order-black.svg",
    preManage: "icons/manage-black.svg",
    menu: "icons/manage-black.svg",
    delivery: "icons/manage-black.svg",
    contact: "icons/contact-black.svg",
  };

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      const page = item.dataset.page;

      // 🧹 Remove profile-wrapper if not on Home page
      if (page !== "home") {
        const oldProfile = document.querySelector(".profile-wrapper");
        if (oldProfile) oldProfile.remove();
      }

      // 🔻 Collapse all open dropdowns
      document.querySelectorAll(".dropdown-content").forEach(dropdown => {
        dropdown.style.display = "none";
      });
      document.querySelectorAll(".dropdown-toggle").forEach(toggle => {
        toggle.setAttribute("aria-expanded", "false");
      });
      document.querySelectorAll(".dropdown-toggle .arrow").forEach(arrow => {
        arrow.classList.remove("rotated"); // Assuming you rotate arrow with this class
      });

      // 🧭 Route handling
      switch (page) {
        case "liveOrder":
          renderLiveOrders();
          break;
        case "preOrder":
          renderPreOrders();
          break;
        case "history":
          renderHistory();
          break;
        case "menu":
          renderMenuManagement();
          break;
        case "contact":
          renderContactPage();
          break;
        case "customOrder":
          renderCustomOrderPage();
          break;
        case "login":
          injectAuthStyles();
          renderLoginPage();
          break;
        case "signup":
          injectAuthStyles();
          renderSignupPage();
          break;
        case "delivery":
          renderDeliveryManagement();
          break;
        case "home":
          injectAuthStyles();
          renderHome();
          break;
        default:
          contentBox.innerHTML = `<h2>${item.textContent.trim()} Page</h2>`;
          contentBox.classList.remove("dashboard-view");
          break;
      }

      pageTitle.textContent =
        page === "preManage" || page === "menu" || page === "delivery"
          ? `${item.textContent.trim()} Management`
          : item.textContent.trim();

      if (icons[page]) {
        iconBox.style.backgroundImage = `url('${icons[page]}')`;
      }

      document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      if (page === "home" || page === "contact") {
        contentBox.style.background = "#fff";
        contentBox.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
      } else {
        contentBox.style.background = "none";
        contentBox.style.boxShadow = "none";
      }
    });
  });
}
