import express from 'express';
import { createContent, getContents,getInboxMessages,getSentMessages,getContentById,updateMessage,getFavoriteMessages } from '../controller/content.controller.js';
import { authenticateJWT } from '../middlewares/auth.js'; // Ensure this middleware exists

const router = express.Router();


router.post('/contents', authenticateJWT, createContent);

router.get('/contents', authenticateJWT, getContents);
router.get('/inbox', authenticateJWT, getInboxMessages);
router.get('/sent',authenticateJWT,getSentMessages);
router.get('/get/:id', authenticateJWT, getContentById);

router.put('/put/:id', updateMessage);
router.get('/getfav',authenticateJWT,getFavoriteMessages);



export default router;
