// backend/src/utils/email.js
const nodemailer = require('nodemailer');

// Create a transporter using the 'gmail' service, just like in your majorhost project.
// This is more reliable and requires less configuration.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email address from .env
        pass: process.env.EMAIL_PASS, // Your App Password from .env
    },
});

const sendVerificationEmail = async (email, token) => {
    const verificationLink = `http://localhost:5173/verify-email?token=${token}`;

    const mailOptions = {
        from: `"SS Infinite" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '✨ Verify Your Email - SS Infinite',
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%); border-radius: 12px 12px 0 0;">
                            <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; margin-bottom: 16px;">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                </svg>
                            </div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">SS Infinite</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 16px; color: #020817; font-size: 24px; font-weight: 600;">Welcome aboard! 🎉</h2>
                            <p style="margin: 0 0 24px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                                Thank you for joining SS Infinite. We're excited to have you! To get started, please verify your email address by clicking the button below.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="margin: 32px 0; width: 100%;">
                                <tr>
                                    <td align="center">
                                        <a href="${verificationLink}" style="display: inline-block; padding: 16px 32px; background-color: #6d28d9; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(109, 40, 217, 0.25);">
                                            Verify Email Address
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 24px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                Or copy and paste this link into your browser:
                            </p>
                            <p style="margin: 8px 0 0; padding: 12px; background-color: #f3f4f6; border-radius: 6px; word-break: break-all;">
                                <a href="${verificationLink}" style="color: #6d28d9; text-decoration: none; font-size: 14px;">${verificationLink}</a>
                            </p>
                            
                            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                                <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.5;">
                                    <strong>Note:</strong> This verification link will expire in 1 hour for security reasons.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; text-align: center;">
                                If you didn't create an account with SS Infinite, you can safely ignore this email.
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                                © ${new Date().getFullYear()} SS Infinite. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully to:', email);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send verification email.');
    }
};
const sendPasswordResetEmail = async (email, otp) => {
    const mailOptions = {
        from: `"SS Infinite" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🔒 Your Password Reset OTP - SS Infinite',
        html: `
            <div style="font-family: sans-serif; text-align: center; padding: 40px;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>Your One-Time Password (OTP) to reset your password is:</p>
                <p style="font-size: 24px; font-weight: bold; color: #6d28d9;">${otp}</p>
                <p>This OTP is valid for 10 minutes.</p>
                <p>If you did not request a password reset, please ignore this email.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset OTP sent successfully to:', email);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email.');
    }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail }; // Add the new function to exports