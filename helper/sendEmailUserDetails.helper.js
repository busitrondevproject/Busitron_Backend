import transporter from "./email.helper.js";

async function sendEmailUserDetails(email, password) {
	try {

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
		return { success: true, message: "Email sent successfully" };
	} catch (err) {
		console.error("Error sending email:", err);
		return { success: false, message: "Failed to send email" };
	}
}

export default sendEmailUserDetails;
