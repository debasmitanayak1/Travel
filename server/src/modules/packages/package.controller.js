import { prisma } from '../../config/db.js';
import { AppError } from '../../middleware/errorHandler.js';

export const getPackages = async (req, res, next) => {
  try {
    const packages = await prisma.package.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });

    const parsed = packages.map((pkg) => {
      let itineraryList = [];
      try {
        itineraryList = JSON.parse(pkg.itinerary || '[]');
      } catch (e) {
        itineraryList = [];
      }
      return {
        ...pkg,
        itineraryList,
      };
    });

    res.status(200).json({
      success: true,
      data: { packages: parsed },
    });
  } catch (error) {
    next(error);
  }
};

export const getPackageBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const pkg = await prisma.package.findUnique({
      where: { slug },
    });

    if (!pkg) {
      return next(new AppError(`Package '${slug}' not found.`, 404));
    }

    let itineraryList = [];
    try {
      itineraryList = JSON.parse(pkg.itinerary || '[]');
    } catch (e) {
      itineraryList = [];
    }

    res.status(200).json({
      success: true,
      data: {
        package: {
          ...pkg,
          itineraryList,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
