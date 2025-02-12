import express from 'express';
import { createFavourite,getFavourites } from '../controller/favourite.controller.js';
import { authenticateJWT } from '../middlewares/auth.js'; // Ensure this middleware exists



const router = express.Router();

router.post('/fav',authenticateJWT,createFavourite);
router.get('/getfav',authenticateJWT,getFavourites);








export default router;
