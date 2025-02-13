import nodemailer from "nodemailer";

async function sendEmailUserDetails(email, password, res) {
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
				rejectUnauthorized: false, // Fix self-signed certificate error
			},
		});

		const mailOptions = {
			from: process.env.EMAIL_USERNAME,
			to: email,
			subject: "Your Account Login Credentials",
			html: `

        <p>Here are your login credentials :-</p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Password:</strong> ${password}</li>
        </ul>
        <p>Please keep these details secure and do not share them with anyone.</p>
        <br>
        <p>Regards,<br>Team Charan</p>
      `,
		};

		await transporter.sendMail(mailOptions);
		return { success: true, message: "Email sent successfully" }; // ✅ Return instead of sending response
	} catch (err) {
		console.error("Error sending email:", err);
		return { success: false, message: "Failed to send email" }; // ✅ Return failure response
	}
}

export default sendEmailUserDetails;
