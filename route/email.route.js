import express from "express";
import authenticateUser from "../middlewares/authMiddleware.js";
import { sendEmail,getCalls,getInboxMessages,getSentMessages,getEmailById,getFavoriteEmails,updateMessage } from "../controller/email.controller.js";

const router = express.Router();

router.post("/send", authenticateUser, sendEmail);
router.get("/history", authenticateUser, getCalls);
router.get("/getinbox", authenticateUser, getInboxMessages);
router.get("/getsent", authenticateUser, getSentMessages);
router.get("/getemail/:id", authenticateUser, getEmailById);
router.get("/starred", authenticateUser, getFavoriteEmails);
router.put("/update/:id", updateMessage);
export default router;
