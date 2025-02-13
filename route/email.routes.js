import express from 'express';
import { createContent, getContents,getInboxMessages,getSentMessages,getContentById,updateMessage,getFavoriteMessages } from '../controller/email.controller.js';
import { verifiedUser } from '../middlewares/verifiedUser.middleware.js';

const router = express.Router();


router.post('/compose', verifiedUser, createContent);

router.get('/mails', verifiedUser, getContents);
router.get('/inbox', verifiedUser, getInboxMessages);
router.get('/sent',verifiedUser,getSentMessages);
router.get('/get/:id', verifiedUser, getContentById);

router.put('/put/:id', updateMessage);
router.get('/starred',verifiedUser,getFavoriteMessages);



export default router;
