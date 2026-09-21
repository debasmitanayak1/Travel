import { Router } from 'express';
import { getArticles, getArticleBySlug } from './travelGuide.controller.js';

const router = Router();

router.get('/', getArticles);
router.get('/:slug', getArticleBySlug);

export default router;
