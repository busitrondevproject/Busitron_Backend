import nodemailer from "nodemailer";

async function passwordForgotInvitation(email, res) {
    console.log(email)
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            host: process.env.EMAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const resetURL = `http://yourfrontend.com/reset-password`
        const mailOptions = {
            from: "pavanponnana1@gmail.com",
            to: email,
            subject: "Password Reset Request",
            html: `
              <h2>Hello,</h2>
              <p>You have requested to reset your password. Click the link below to reset your password:</p>
              <a href="${resetURL}" style="display: inline-block; padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
              <p>This link is valid for 30 minutes. If you did not request this, please ignore this email.</p>
              <br>
              <p>Regards,<br>Team Ponnana</p>
            `,
          };
        await transporter.sendMail(mailOptions);
        return { success: true, message: "Email sent successfully" };
    } catch (err) {
        console.error("Error sending email:", err);
        return { success: false, message: "Email not sent" };
    }
}
export default passwordForgotInvitation;
