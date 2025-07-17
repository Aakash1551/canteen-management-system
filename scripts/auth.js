import { showDashboardAfterLogin } from "./main.js";

// ✅ On Login Success
export function handleLoginSuccess() {
  localStorage.setItem("isLoggedIn", "true");
  showDashboardAfterLogin();
}

export function injectAuthStyles() {
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "css/login.css"; // ✅ Make sure this file exists
  document.head.appendChild(style);
}

// 🔐 SIGNUP PAGE
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

  document.getElementById("signup-btn").addEventListener("click", () => {
    handleLoginSuccess(); // Replace with validation logic later
  });
}

// 🔐 LOGIN PAGE
export function renderLoginPage() {
  document.getElementById("auth-screen").innerHTML = `
    <div class="login-container">
      <div class="login-left-wrapper">
        <div class="login-left"></div>
      </div>

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

  // ✅ Render icons
  if (window.lucide) lucide.createIcons();

  // 👁 Toggle password visibility
  const passwordInput = document.getElementById("login-password");
  const eyeToggle = document.querySelector(".eye-toggle");

  if (passwordInput && eyeToggle) {
    eyeToggle.addEventListener("click", () => {
      const isVisible = passwordInput.type === "text";
      passwordInput.type = isVisible ? "password" : "text";
      eyeToggle.querySelector(".show-eye").style.display = isVisible ? "block" : "none";
      eyeToggle.querySelector(".hide-eye").style.display = isVisible ? "none" : "block";
    });
  }

  // 🔘 Login button
  document.getElementById("login-btn").addEventListener("click", () => {
    handleLoginSuccess(); // Replace with auth logic later
  });

  // 🔁 Switch to Signup
  document.getElementById("gotoSignup").addEventListener("click", (e) => {
    e.preventDefault();
    renderSignupPage();
  });
}
