import { prisma } from '../../config/db.js';

export const getActivities = async (req, res, next) => {
  try {
    const { category, difficulty, destinationId } = req.query;

    const where = {};
    if (category && category !== 'All') {
      where.category = category;
    }
    if (difficulty && difficulty !== 'All') {
      where.difficulty = difficulty;
    }
    if (destinationId) {
      where.destinationId = destinationId;
    }

    const activities = await prisma.activity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: { activities },
    });
  } catch (error) {
    next(error);
  }
};
