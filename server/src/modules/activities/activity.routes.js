import { Router } from 'express';
import { getActivities } from './activity.controller.js';

const router = Router();

router.get('/', getActivities);

export default router;
