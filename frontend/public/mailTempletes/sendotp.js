export const otpEmailTemplate = (email, otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Secure OTP</title>
      <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              background: linear-gradient(to bottom right, #f8fafc, #f1f5f9);
              margin: 0;
              padding: 0;
              color: #0f172a;
              line-height: 1.6;
          }
          
          .container {
              max-width: 600px;
              background: white;
              margin: 40px auto;
              padding: 0;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .header {
              background: linear-gradient(135deg, #6366f1, #8b5cf6);
              padding: 40px 20px;
              text-align: center;
              color: white;
          }
          
          .logo {
              height: 42px;
              margin-bottom: 20px;
          }
          
          h1 {
              font-size: 26px;
              font-weight: 700;
              margin: 0 0 8px 0;
              letter-spacing: -0.5px;
          }
          
          .subheader {
              font-size: 15px;
              opacity: 0.9;
              font-weight: 400;
          }
          
          .content {
              padding: 40px;
          }
          
          .otp-container {
              background: #f8fafc;
              border-radius: 12px;
              padding: 30px;
              margin: 30px 0;
              text-align: center;
              border: 1px dashed #cbd5e1;
          }
          
          .otp-code {
              font-size: 42px;
              font-weight: 700;
              letter-spacing: 8px;
              color: #6366f1;
              margin: 15px 0;
              font-family: 'Courier New', monospace;
          }
          
          .message {
              font-size: 16px;
              color: #475569;
              margin-bottom: 24px;
              line-height: 1.7;
          }
          
          .highlight {
              font-weight: 600;
              color: #0f172a;
          }
          
          .expiry {
              display: inline-block;
              background: #f1f5f9;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 500;
              color: #64748b;
              margin: 15px 0;
          }
          
          .warning {
              font-size: 14px;
              color: #64748b;
              font-style: italic;
              margin-top: 25px;
          }
          
          .footer {
              padding: 25px;
              background: #f8fafc;
              text-align: center;
              font-size: 13px;
              color: #64748b;
              border-top: 1px solid #e2e8f0;
          }
          
          .footer a {
              color: #6366f1;
              text-decoration: none;
              font-weight: 500;
          }
          
          @media (max-width: 640px) {
              .container {
                  margin: 20px;
                  border-radius: 12px;
              }
              
              .content {
                  padding: 30px 20px;
              }
              
              .otp-code {
                  font-size: 32px;
                  letter-spacing: 5px;
              }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <!-- Replace with your logo -->
              <img src="https://yourdomain.com/logo-white.png" alt="Company Logo" class="logo">
              <h1>Your Verification Code</h1>
              <p class="subheader">Secure access to your account</p>
          </div>
          
          <div class="content">
              <p class="message">
                  Hello <span class="highlight">${email}</span>,<br>
                  Here's your One-Time Password (OTP) to verify your identity:
              </p>
              
              <div class="otp-container">
                  <div class="otp-code">${otp}</div>
              </div>
              
              <p class="message">
                  Please enter this code in the verification page to complete your action.
                  <br>Do not share this code with anyone.
              </p>
              
              <p class="warning">
                  If you didn't request this code, please ignore this email or contact support.
              </p>
          </div>
          
          <div class="footer">
              Need help? <a href="mailto:support@yourdomain.com">Contact our support team</a><br>
              © ${new Date().getFullYear()} Your Company. All rights reserved.
          </div>
      </div>
  </body>
  </html>
  `;
};