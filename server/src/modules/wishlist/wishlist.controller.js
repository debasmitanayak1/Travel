import { prisma } from '../../config/db.js';
import { AppError } from '../../middleware/errorHandler.js';

export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      include: {
        destination: {
          include: {
            images: { take: 1 },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: { wishlist },
    });
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const { destinationId } = req.params;

    const destination = await prisma.destination.findUnique({
      where: { id: destinationId },
    });

    if (!destination) {
      return next(new AppError('Destination not found.', 404));
    }

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_destinationId: {
          userId: req.user.id,
          destinationId,
        },
      },
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Destination already in wishlist.',
        data: { item: existing },
      });
    }

    const item = await prisma.wishlist.create({
      data: {
        userId: req.user.id,
        destinationId,
      },
      include: {
        destination: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Added to wishlist.',
      data: { item },
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { destinationId } = req.params;

    await prisma.wishlist.deleteMany({
      where: {
        userId: req.user.id,
        destinationId,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Removed from wishlist.',
    });
  } catch (error) {
    next(error);
  }
};
