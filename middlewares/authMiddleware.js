import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandle.js";

const authenticateUser = (req, res, next) => {
	const token =
		req.cookies["accessToken"] ||
		req.headers["authorization"]?.split(" ")[1];

	if (!token) return next(new errorHandler(401, "Token is not provided"));

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		return next(new errorHandler(403, "Invalid or expired token"));
	}
};

export default authenticateUser;
