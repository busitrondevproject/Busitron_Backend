import nodemailer from "nodemailer";

async function changePasswordSuccessfulinviation(email, res) {
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
            subject: "Password Changed Successfully",
            html: `
              <h2>Hello,</h2>
              <p>Your password has been changed successfully.</p>
              <p>If you did not make this change, please contact our support team immediately.</p>
              <br>
              <p>Regards,<br>Busitron</p>
            `,
          };
        await transporter.sendMail(mailOptions);
        return { success: true, message: "Email sent successfully" };
    } catch (err) {
        console.error("Error sending email:", err);
        return { success: false, message: "Email not sent" };
    }
}
export default changePasswordSuccessfulinviation;
