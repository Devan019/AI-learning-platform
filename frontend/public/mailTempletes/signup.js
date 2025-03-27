export const signupEmailTemplate = (username, email, websiteUrl) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome Aboard! 🚀</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
            
            body {
                font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
                background: linear-gradient(135deg, #f5f7fa 0%, #f8fafc 100%);
                margin: 0;
                padding: 0;
                color: #2d3748;
                line-height: 1.6;
            }
            
            .container {
                max-width: 600px;
                background: #ffffff;
                margin: 40px auto;
                padding: 0;
                border-radius: 16px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                overflow: hidden;
                text-align: center;
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 20px;
                color: white;
            }
            
            .logo {
                height: 48px;
                margin-bottom: 16px;
            }
            
            h1 {
                font-size: 28px;
                font-weight: 700;
                margin: 0 0 8px 0;
                letter-spacing: -0.5px;
            }
            
            .subheader {
                font-size: 16px;
                opacity: 0.9;
                font-weight: 400;
            }
            
            .content {
                padding: 40px;
            }
            
            .welcome-message {
                font-size: 18px;
                color: #4a5568;
                margin-bottom: 24px;
            }
            
            .user-card {
                background: #f8fafc;
                border-radius: 12px;
                padding: 24px;
                margin: 24px 0;
                text-align: left;
                border: 1px solid #edf2f7;
            }
            
            .user-info {
                display: flex;
                align-items: center;
                margin-bottom: 16px;
            }
            
            .avatar {
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 20px;
                margin-right: 16px;
            }
            
            .user-details {
                flex: 1;
            }
            
            .username {
                font-weight: 600;
                font-size: 18px;
                margin: 0 0 4px 0;
            }
            
            .email {
                color: #718096;
                font-size: 14px;
                margin: 0;
            }
            
            .cta-button {
                display: inline-block;
                padding: 16px 32px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                font-size: 16px;
                font-weight: 600;
                border-radius: 8px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                margin: 16px 0;
            }
            
            .cta-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
            }
            
            .features {
                display: flex;
                justify-content: space-between;
                margin: 32px 0;
                flex-wrap: wrap;
            }
            
            .feature {
                flex: 0 0 30%;
                margin-bottom: 16px;
            }
            
            .feature-icon {
                font-size: 24px;
                margin-bottom: 8px;
                color: #667eea;
            }
            
            .feature-title {
                font-weight: 600;
                font-size: 14px;
                margin: 0;
            }
            
            .footer {
                padding: 24px;
                background: #f8fafc;
                font-size: 14px;
                color: #718096;
                border-top: 1px solid #edf2f7;
            }
            
            .footer a {
                color: #667eea;
                text-decoration: none;
            }
            
            @media (max-width: 640px) {
                .container {
                    margin: 20px;
                }
                
                .content {
                    padding: 24px;
                }
                
                .features {
                    flex-direction: column;
                }
                
                .feature {
                    flex: 0 0 100%;
                    margin-bottom: 24px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <!-- Replace with your logo -->
                <img src="https://yourdomain.com/logo-white.png" alt="Company Logo" class="logo">
                <h1>Welcome Aboard, ${username}!</h1>
                <p class="subheader">Your journey starts here</p>
            </div>
            
            <div class="content">
                <p class="welcome-message">
                    We're thrilled to have you join our community. Get ready for an amazing experience!
                </p>
                
                <div class="user-card">
                    <div class="user-info">
                        <div class="avatar">${username.charAt(0).toUpperCase()}</div>
                        <div class="user-details">
                            <h3 class="username">${username}</h3>
                            <p class="email">${email}</p>
                        </div>
                    </div>
                    <p>Your account has been successfully created and is ready to use.</p>
                </div>
                
                <a href="${websiteUrl}" class="cta-button">Start Exploring</a>
                
                <div class="features">
                    <div class="feature">
                        <div class="feature-icon">✨</div>
                        <h4 class="feature-title">Premium Features</h4>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">⚡</div>
                        <h4 class="feature-title">Lightning Fast</h4>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">🔒</div>
                        <h4 class="feature-title">Secure Platform</h4>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                Need help? <a href="mailto:support@example.com">Contact our team</a><br>
                © ${new Date().getFullYear()} Your Company. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
  };