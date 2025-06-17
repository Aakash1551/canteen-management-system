// contact.js

export function renderContactPage() {
  document.getElementById('content-box').innerHTML = `
    <div class="contact-container" style="padding: 30px; text-align: center;">
      <h2 style="font-size: 32px;">Contact Us</h2>
      <p style="font-size: 18px; color: #555;">
        Have questions, feedback, or need assistance? Our team is here to help you!
      </p>
      <div style="display: inline-block; text-align: left; font-size: 18px; line-height: 1.6; color: #333;">
        <p><strong>Phone:</strong> +91 98765 43210</p>
        <p><strong>Email:</strong> support@example.com</p>
        <p><strong>Address:</strong> 123, Your Street, Your City, India</p>
      </div>
      <p style="margin-top: 20px; font-size: 16px; color: #666;">
        We’re available 24/7. Your satisfaction is our priority!
      </p>
    </div>
  `;
}
