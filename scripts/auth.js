import { showDashboardAfterLogin } from "./main.js";

// 🔐 SIGNUP PAGE
export function renderSignupPage() {
  document.getElementById("auth-screen").innerHTML = `
    <div class="auth-bg signup-bg">
      <div class="signup-box">
        <input class="auth-input" type="text" placeholder="Username\\E-Mail" />
        <input class="auth-input" type="password" placeholder="Password" />
        <input class="auth-input" type="password" placeholder="Confirm Password" />
        <p class="switch-text">Already have an account? <a href="#" id="gotoLogin">Login</a></p>
        <button class="auth-btn">Sign up</button>
      </div>
    </div>
  `;

  document.getElementById("gotoLogin").addEventListener("click", (e) => {
    e.preventDefault();
    renderLoginPage();
  });

  document.querySelector(".auth-btn").addEventListener("click", () => {
    handleLoginSuccess();
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

              <!-- 👇 Dual icon setup (one shown, one hidden) -->
              <span class="eye-toggle" style="cursor: pointer; display: flex;">
                <i data-lucide="eye" class="eye-icon show-eye"></i>
                <i data-lucide="eye-off" class="eye-icon hide-eye" style="display: none;"></i>
              </span>
            </div>
          </div>

          <a href="#" class="forgot-password">Forgot Password?</a>
          <button class="auth-btn">Log In</button>

          <div class="signup-link">
            Don’t have an account? <a href="#">Sign up here</a>
          </div>
        </div>
      </div>
    </div>
  `;

  // ✅ Render Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // ✅ Setup logic AFTER icons are in DOM
  setTimeout(() => {
    // Eye toggle logic
    const passwordInput = document.getElementById("login-password");
    const eyeToggle = document.querySelector(".eye-toggle");

    if (passwordInput && eyeToggle) {
      eyeToggle.addEventListener("click", () => {
        const isVisible = passwordInput.type === "text";
        passwordInput.type = isVisible ? "password" : "text";

        // Swap visibility of icons without re-render
        eyeToggle.querySelector(".show-eye").style.display = isVisible ? "block" : "none";
        eyeToggle.querySelector(".hide-eye").style.display = isVisible ? "none" : "block";
      });
    }

    // Login button click
    const loginBtn = document.querySelector(".auth-btn");
    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        handleLoginSuccess();
      });
    }
  }, 0);
}


// 🧠 Inject styles for login/signup pages
export function injectAuthStyles() {
  if (document.getElementById("auth-style")) return;

  const style = document.createElement("style");
  style.id = "auth-style";
  style.textContent = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      height: 100%;
      font-family: 'Kanit', sans-serif;
      overflow: hidden;
      background-color: #fff;
    }

    .login-container {
      display: flex;
      height: 100vh;
      width: 100vw;
    }

    .login-left-wrapper {
  width: 50%;
  height: 100vh;
  padding: 10px;
  background-color: white;
  overflow: hidden;             /* 👈 Enables border-radius to clip inside */
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  
}

.login-left {
  width: 100%;
  height: 100%;
  background-image: url('icons/login-bg.jpg');
  background-size: cover;
  background-position: center;
  
  border-radius: 20px;     /* 👈 Round the corners */
  overflow: hidden;        /* 👈 Clip the image inside those corners */
}




    .login-right {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  box-sizing: border-box;
}
  .input-icon {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px 12px;
  gap: 10px; /* adds space between icon, line, and input */
}

.divider {
  width: 1px;
  height: 20px;
  background-color: #ccc;
  margin: 0 6px;
}



    .login-box {
      width: 100%;
      max-width: 350px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .auth-lock-icon {
      width: 50px;
      margin: 0 auto;
    }

    .login-box h2 {
      font-size: 26px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 40px;
      margin-top: -10px;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .input-group label {
      font-weight: 600;
      font-size: 14px;
    }

    .input-icon {
      display: flex;
      align-items: center;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 10px 12px;
    }

    .input-icon i {
      margin-right: 8px;
      color: #555;
    }

    .input-icon input {
      border: none;
      outline: none;
      font-size: 14px;
      flex-grow: 1;
    }

    .eye-toggle {
      color: #888;
      cursor: pointer;
    }

    .forgot-password {
      font-size: 12px;
      text-align: right;
      color: #e74c3c;
      margin-top: -10px;
    }

    .auth-btn {
      width: 100%;
      padding: 12px;
      background-color: #20c997;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      font-size: 16px;
    }

    .auth-btn:hover {
      background-color: #17b08d;
    }

    .signup-link {
      font-size: 13px;
      text-align: center;
      margin-top: 20px;
      color: #444;
    }

    .signup-link a {
      color: #007bff;
      margin-left: 4px;
      text-decoration: none;
    }
  `;
  document.head.appendChild(style);
}

// ✅ On Login Success
export function handleLoginSuccess() {
  localStorage.setItem("isLoggedIn", "true");
  showDashboardAfterLogin();
}
