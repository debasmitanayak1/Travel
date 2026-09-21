import { Router } from 'express';
import { getHotels } from './hotel.controller.js';

const router = Router();

router.get('/', getHotels);

export default router;
