import { showDashboardAfterLogin } from './main.js';

// 🔐 SIGNUP PAGE
export function renderSignupPage() {
  document.getElementById('auth-screen').innerHTML = `
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

  document.getElementById('gotoLogin').addEventListener('click', (e) => {
    e.preventDefault();
    renderLoginPage();
  });

  document.querySelector('.auth-btn').addEventListener('click', () => {
    // Normally you'd do validation here
    handleLoginSuccess();
  });
}

// 🔐 LOGIN PAGE
export function renderLoginPage() {
  document.getElementById('auth-screen').innerHTML = `
    <div class="auth-bg login-bg">
      <div class="login-box">
        <input class="auth-input" type="text" placeholder="Username\\E-Mail" />
        <input class="auth-input" type="password" placeholder="Password" />
        <p class="switch-text">Don't have an account? <a href="#" id="gotoSignup">Sign up</a></p>
        <button class="auth-btn">Login</button>
      </div>
    </div>
  `;

  document.getElementById('gotoSignup').addEventListener('click', (e) => {
    e.preventDefault();
    renderSignupPage();
  });

  document.querySelector('.auth-btn').addEventListener('click', () => {
    // Normally you'd do validation here
    handleLoginSuccess();
  });
}

// 🧠 STYLES INJECTION
export function injectAuthStyles() {
  if (document.getElementById('auth-style')) return;
  const style = document.createElement('style');
  style.id = 'auth-style';
  style.textContent = `
    .auth-bg {
      width: 100%;
      height: 100vh;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .signup-bg {
      background-image: url('/icons/signup-bg.png');
    }
    .login-bg {
      background-image: url('/icons/login-bg.png');
    }
    .signup-box, .login-box {
      background: #ffeead;
      padding: 30px;
      border-radius: 10px;
      width: 300px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .auth-input {
      width: 100%;
      padding: 10px;
      margin: 8px 0;
      border-radius: 6px;
      border: none;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    .auth-btn {
      margin-top: 10px;
      padding: 10px 20px;
      background: #2ecc71;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
    }
    .switch-text {
      font-size: 13px;
      margin: 10px 0;
      color: #333;
    }
    .switch-text a {
      color: #2980b9;
      text-decoration: none;
    }
  `;
  document.head.appendChild(style);
}

// ✅ LOGIN SUCCESS HO TOH DASHBOARD CHALA DO
export function handleLoginSuccess() {
  localStorage.setItem('isLoggedIn', 'true'); // ✅ Mark user as logged in
  showDashboardAfterLogin();
}

