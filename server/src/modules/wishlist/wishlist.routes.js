import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from './wishlist.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate);
router.get('/', getWishlist);
router.post('/:destinationId', addToWishlist);
router.delete('/:destinationId', removeFromWishlist);

export default router;
