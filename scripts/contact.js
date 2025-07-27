export function renderContactPage() {
  document.getElementById('content-box').innerHTML = `
    <div class="contact-card fade-in">
      <h2 class="contact-title">Contact Us</h2>

      <p class="contact-subtext">
        Have questions, feedback, or need assistance? Our team is here to help you!
      </p>

      <div class="contact-info-box hover-lift">
        <p><span class="label phone">📞 Phone:</span> +91 98765 43210</p>
        <p><span class="label email">✉️ Email:</span> support@example.com</p>
        <p><span class="label address">📍 Address:</span> 123, Your Street, Your City, India</p>
      </div>

      <p class="contact-note">
        We’re available 24/7. Your satisfaction is our priority!
      </p>
    </div>
  `;
}
