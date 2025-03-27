export const resetPasswordEmailTemplate = (email, token) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                background-color: #f8fafc;
                margin: 0;
                padding: 0;
                color: #334155;
                line-height: 1.5;
            }
            
            .container {
                max-width: 600px;
                background: #ffffff;
                margin: 40px auto;
                padding: 40px;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
                text-align: center;
                border: 1px solid #e2e8f0;
            }
            
            .logo {
                height: 48px;
                margin-bottom: 24px;
            }
            
            h1 {
                color: #0f172a;
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 16px;
            }
            
            .email-display {
                display: inline-block;
                background: #f1f5f9;
                padding: 8px 16px;
                border-radius: 8px;
                font-weight: 500;
                margin: 12px 0;
                color: #334155;
            }
            
            .message {
                font-size: 16px;
                color: #64748b;
                margin: 24px 0;
                line-height: 1.6;
            }
            
            .cta-button {
                display: inline-block;
                padding: 16px 32px;
                background: #2563eb;
                color: #ffffff;
                text-decoration: none;
                font-size: 16px;
                font-weight: 600;
                border-radius: 8px;
                transition: all 0.2s ease;
                box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
            }
            
            .cta-button:hover {
                background: #1d4ed8;
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
            }
            
            .expiry-note {
                font-size: 14px;
                color: #94a3b8;
                margin: 24px 0;
                font-style: italic;
            }
            
            .support {
                margin-top: 32px;
                padding-top: 24px;
                border-top: 1px solid #e2e8f0;
                font-size: 14px;
                color: #64748b;
            }
            
            .support a {
                color: #2563eb;
                text-decoration: none;
                font-weight: 500;
            }
            
            .footer {
                margin-top: 40px;
                font-size: 12px;
                color: #94a3b8;
            }
            
            @media (max-width: 640px) {
                .container {
                    margin: 20px;
                    padding: 24px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Replace with your logo -->
            <img src="https://yourdomain.com/logo.png" alt="Company Logo" class="logo">
            
            <h1>Reset Your Password</h1>
            
            <div class="email-display">${email}</div>
            
            <p class="message">
                You recently requested to reset your password. Click the button below to proceed. 
                This link will expire in 30 minutes for your security.
            </p>
            
            <a href="http://localhost:5173/resetpassword?resetToken=${token}" class="cta-button">
                Reset Password
            </a>
            
            <p class="expiry-note">
                If you didn't request this password reset, you can safely ignore this email.
            </p>
            
            <div class="support">
                Need help? <a href="mailto:support@example.com">Contact our support team</a>
            </div>
            
            <div class="footer">
                © ${new Date().getFullYear()} Your Company. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
  };