import Email from "../models/email.models.js";

export const sendEmail = async (req, res, next) => {
	try {
		console.log("Request User:", req.user);

		const { subject, content, to_userid, attachments } = req.body;
		const from_userid = req.user?._id;

		if (!from_userid) {
			return res
				.status(401)
				.json({ success: false, message: "User not authenticated" });
		}

		if (!subject || !content || !to_userid) {
			return res
				.status(400)
				.json({ success: false, message: "Missing required fields" });
		}

		const newEmail = new Email({
			subject,
			content,
			to_userid,
			from_userid,
			attachments,
		});
		await newEmail.save();

		res.status(201).json({
			success: true,
			message: "Email sent successfully",
			newEmail,
		});
	} catch (error) {
		next(error);
	}
};



export const getInboxMessages = async (req, res) => {
	try {
		const userId = req.user?._id;

		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const inboxMessages = await Email.find({ to_userid: userId })
			.populate("from_userid", "username email")
			.populate("to_userid", "username email")
			.sort({ createdAt: -1 });

		res.status(200).json(inboxMessages);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getSentMessages = async (req, res) => {
	try {
		const userId = req.user?._id;

		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const sentMessages = await Email.find({ from_userid: userId })
			.populate("from_userid", "username email")
			.populate("to_userid", "username email")
			.sort({ createdAt: -1 });

		res.status(200).json(sentMessages);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getEmailById = async (req, res) => {
	try {
		const userId = req.user?._id;
		const { id } = req.params;

		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const email = await Email.findOne({
			_id: id,
			$or: [{ from_userid: userId }, { to_userid: userId }],
		})
			.populate("from_userid", "username email")
			.populate("to_userid", "username email");

		if (!email) {
			return res.status(404).json({ message: "Email not found" });
		}

		res.status(200).json(email);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getFavoriteEmails = async (req, res) => {
	try {
		const userId = req.user?._id;

		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const favoriteEmails = await Email.find({
			value: 1,
			$or: [{ from_userid: userId }, { to_userid: userId }],
		})
			.populate("from_userid", "username email")
			.populate("to_userid", "username email")
			.sort({ createdAt: -1 });

		res.status(200).json({
			message: "Favorite emails fetched successfully",
			favoriteEmails,
		});
	} catch (error) {
		console.error("Error fetching favorite emails:", error);
		res.status(500).json({
			error: "Failed to fetch favorite emails. Please try again.",
		});
	}
};

export const updateMessage = async (req, res) => {
	try {
		const { id } = req.params;
		const { value } = req.body;

		const message = await Email.findById(id);

		if (!message) {
			return res.status(404).json({ error: "Message not found" });
		}

		message.value = value ?? 0;
		await message.save();

		res.status(200).json({
			message: "Message updated successfully",
			updatedMessage: message,
		});
	} catch (error) {
		console.error("Error updating message:", error);
		res.status(500).json({
			error: "Failed to update message. Please try again.",
		});
	}
};
