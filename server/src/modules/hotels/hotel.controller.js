import { prisma } from '../../config/db.js';

export const getHotels = async (req, res, next) => {
  try {
    const { destinationId, starRating, maxPrice, search } = req.query;

    const where = {};

    if (destinationId) {
      where.destinationId = destinationId;
    }

    if (starRating) {
      where.starRating = { gte: parseInt(starRating, 10) };
    }

    if (maxPrice) {
      where.pricePerNight = { lte: parseInt(maxPrice, 10) };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const hotels = await prisma.hotel.findMany({
      where,
      orderBy: { starRating: 'desc' },
      include: {
        destination: {
          select: {
            id: true,
            slug: true,
            name: true,
            country: true,
          },
        },
      },
    });

    const parsed = hotels.map((h) => {
      let amenitiesList = [];
      try {
        amenitiesList = JSON.parse(h.amenities || '[]');
      } catch (e) {
        amenitiesList = [];
      }
      return {
        ...h,
        amenitiesList,
      };
    });

    res.status(200).json({
      success: true,
      data: { hotels: parsed },
    });
  } catch (error) {
    next(error);
  }
};
