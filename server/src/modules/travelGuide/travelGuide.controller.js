import { prisma } from '../../config/db.js';
import { AppError } from '../../middleware/errorHandler.js';

export const getArticles = async (req, res, next) => {
  try {
    const { category } = req.query;
    const where = { isPublished: true };

    if (category && category !== 'All') {
      where.category = category;
    }

    const articles = await prisma.guideArticle.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: { articles },
    });
  } catch (error) {
    next(error);
  }
};

export const getArticleBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const article = await prisma.guideArticle.findUnique({
      where: { slug },
    });

    if (!article) {
      return next(new AppError(`Article '${slug}' not found.`, 404));
    }

    res.status(200).json({
      success: true,
      data: { article },
    });
  } catch (error) {
    next(error);
  }
};
