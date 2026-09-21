import { prisma } from '../../config/db.js';
import { AppError } from '../../middleware/errorHandler.js';

export const getDestinations = async (req, res, next) => {
  try {
    const { search, continent, minBudget, maxBudget, sort, limit = 20, page = 1 } = req.query;

    const where = {
      isPublished: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { country: { contains: search } },
        { tagline: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (continent && continent !== 'All') {
      where.continent = { equals: continent };
    }

    if (minBudget || maxBudget) {
      where.AND = [];
      if (minBudget) {
        where.AND.push({ avgBudgetMin: { gte: parseInt(minBudget, 10) } });
      }
      if (maxBudget) {
        where.AND.push({ avgBudgetMax: { lte: parseInt(maxBudget, 10) } });
      }
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'budget-asc') orderBy = { avgBudgetMin: 'asc' };
    if (sort === 'budget-desc') orderBy = { avgBudgetMax: 'desc' };
    if (sort === 'name-asc') orderBy = { name: 'asc' };

    const take = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * take;

    const [total, destinations] = await Promise.all([
      prisma.destination.count({ where }),
      prisma.destination.findMany({
        where,
        take,
        skip,
        orderBy,
        include: {
          images: {
            take: 3,
          },
          _count: {
            select: {
              attractions: true,
              hotels: true,
              restaurants: true,
            },
          },
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        destinations,
        pagination: {
          total,
          page: parseInt(page, 10),
          pages: Math.ceil(total / take),
          limit: take,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedDestinations = async (req, res, next) => {
  try {
    const featured = await prisma.destination.findMany({
      where: { isPublished: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        images: {
          take: 2,
        },
        _count: {
          select: {
            attractions: true,
            hotels: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: { destinations: featured },
    });
  } catch (error) {
    next(error);
  }
};

export const getDestinationBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const destination = await prisma.destination.findUnique({
      where: { slug },
      include: {
        images: true,
        attractions: true,
        hotels: true,
        restaurants: true,
        transportOptions: true,
      },
    });

    if (!destination) {
      return next(new AppError(`Destination '${slug}' not found.`, 404));
    }

    // Format hotel amenities from JSON string if needed
    const formattedHotels = destination.hotels.map((hotel) => {
      let amenitiesList = [];
      try {
        amenitiesList = JSON.parse(hotel.amenities || '[]');
      } catch (e) {
        amenitiesList = [];
      }
      return {
        ...hotel,
        amenitiesList,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        destination: {
          ...destination,
          hotels: formattedHotels,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
