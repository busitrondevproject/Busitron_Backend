import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandle.js";

const authenticateUser = (req, res, next) => {
	const token = req.cookies["accessToken"];

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		req.user = decoded;
		next(); // Move to the next middleware
	} catch (error) {
		throw new errorHandler(403, "Invalid or expired token");
		next();
	}
};

export default authenticateUser;
