import { Router } from 'express';
import { prisma } from '../../config/db.js';
import { fetchWeatherForDestination } from './weather.service.js';
import { AppError } from '../../middleware/errorHandler.js';

const router = Router();

router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const destination = await prisma.destination.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        country: true,
        latitude: true,
        longitude: true,
      },
    });

    if (!destination) {
      return next(new AppError(`Destination '${slug}' not found.`, 404));
    }

    const weather = await fetchWeatherForDestination(destination);

    res.status(200).json({
      success: true,
      data: { weather },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
