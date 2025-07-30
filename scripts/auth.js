import { showDashboardAfterLogin } from "./main.js";
import { showToast } from "./popup.js";

const BASE_URL = "http://192.168.213.174:8000";

export function handleLoginSuccess(token) {
  localStorage.setItem("isLoggedIn", "true");
  if (token) localStorage.setItem("authToken", token); // ✅ Correct key
  showToast("Login successful!", "success");
  showDashboardAfterLogin();
}

export function injectAuthStyles() {
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "css/login.css";
  document.head.appendChild(style);
}

export function renderSignupPage() {
  document.getElementById("auth-screen").innerHTML = `
    <div class="auth-bg signup-bg">
      <div class="signup-box">
        <h2>Create Account</h2>
        <input class="auth-input" type="text" placeholder="Username / E-Mail" />
        <input class="auth-input" type="password" placeholder="Password" />
        <input class="auth-input" type="password" placeholder="Confirm Password" />
        <button class="auth-btn" id="signup-btn">Sign up</button>
        <p class="switch-text">
          Already have an account? <a href="#" id="gotoLogin">Login</a>
        </p>
      </div>
    </div>
  `;

  document.getElementById("gotoLogin").addEventListener("click", (e) => {
    e.preventDefault();
    renderLoginPage();
  });

  document.getElementById("signup-btn").addEventListener("click", async () => {
    const inputs = document.querySelectorAll(".auth-input");
    const email = inputs[0].value.trim();
    const password = inputs[1].value;
    const confirmPassword = inputs[2].value;

    if (!email || !password || !confirmPassword) {
      showToast("All fields are required.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/canteen-signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg =
          data?.message ||
          data?.detail ||
          data?.non_field_errors?.[0] ||
          (typeof data === "object" ? Object.values(data)[0]?.[0] : null) ||
          "Signup failed";
        showToast(msg, "error");
        return;
      }

      handleLoginSuccess(data.token);
    } catch (err) {
      console.error(err);
      showToast("Something went wrong.", "error");
    }
  });
}

export function renderLoginPage() {
  document.getElementById("auth-screen").innerHTML = `
    <div class="login-container">
      <div class="login-left-wrapper"><div class="login-left"></div></div>
      <div class="login-right">
        <div class="login-box">
          <h2>Login</h2>

          <div class="input-group">
            <label for="login-email">Mail / Username</label>
            <div class="input-icon">
              <i data-lucide="mail"></i>
              <div class="divider"></div>
              <input type="text" id="login-email" placeholder="Enter username" />
            </div>
          </div>

          <div class="input-group">
            <label for="login-password">Password</label>
            <div class="input-icon">
              <i data-lucide="lock"></i>
              <div class="divider"></div>
              <input type="password" id="login-password" placeholder="Enter password" />
              <span class="eye-toggle" style="cursor: pointer; display: flex;">
                <i data-lucide="eye" class="eye-icon show-eye"></i>
                <i data-lucide="eye-off" class="eye-icon hide-eye" style="display: none;"></i>
              </span>
            </div>
          </div>

          <a href="#" class="forgot-password">Forgot Password?</a>
          <button class="auth-btn" id="login-btn">Log In</button>

          <div class="signup-link">
            Don’t have an account? <a href="#" id="gotoSignup">Sign up here</a>
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();

  const passwordInput = document.getElementById("login-password");
  const emailInput = document.getElementById("login-email");
  const eyeToggle = document.querySelector(".eye-toggle");
  const loginBtn = document.getElementById("login-btn");

  if (passwordInput && eyeToggle) {
    eyeToggle.addEventListener("click", () => {
      const isVisible = passwordInput.type === "text";
      passwordInput.type = isVisible ? "password" : "text";
      eyeToggle.querySelector(".show-eye").style.display = isVisible ? "block" : "none";
      eyeToggle.querySelector(".hide-eye").style.display = isVisible ? "none" : "block";
    });
  }

  // 🔑 Press Enter triggers login
  [emailInput, passwordInput].forEach((input) => {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        loginBtn.click();
      }
    });
  });

  loginBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/canteen-login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        let msg =
          data?.message ||
          data?.detail ||
          data?.non_field_errors?.[0] ||
          (typeof data === "object" ? Object.values(data)[0]?.[0] : null) ||
          "Login failed";

        msg = msg.toLowerCase();

        if (msg.includes("not a canteen owner")) {
          showToast("Only canteen owners can log in.", "error");
        } else if (msg.includes("invalid") || msg.includes("not found")) {
          showToast("Invalid email or password.", "error");
        } else {
          showToast(msg.charAt(0).toUpperCase() + msg.slice(1), "error");
        }
        return;
      }

      handleLoginSuccess(data.token);
    } catch (err) {
      console.error(err);
      showToast("Something went wrong.", "error");
    }
  });

  document.getElementById("gotoSignup").addEventListener("click", (e) => {
    e.preventDefault();
    renderSignupPage();
  });
}
