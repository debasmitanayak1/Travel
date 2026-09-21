import { Router } from 'express';
import {
  getDestinations,
  getFeaturedDestinations,
  getDestinationBySlug,
} from './destination.controller.js';

const router = Router();

router.get('/featured', getFeaturedDestinations);
router.get('/', getDestinations);
router.get('/:slug', getDestinationBySlug);

export default router;
