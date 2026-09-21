import { prisma } from '../../config/db.js';
import { AppError } from '../../middleware/errorHandler.js';

// ==========================================
// 1. STATS & OVERVIEW
// ==========================================
export const getAdminStats = async (req, res, next) => {
  try {
    const [
      destinations,
      hotels,
      restaurants,
      packages,
      activities,
      articles,
      users,
      submissions,
      unreadSubmissions,
    ] = await Promise.all([
      prisma.destination.count(),
      prisma.hotel.count(),
      prisma.restaurant.count(),
      prisma.package.count(),
      prisma.activity.count(),
      prisma.guideArticle.count(),
      prisma.user.count(),
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({ where: { isRead: false } }),
    ]);

    // Continent breakdown
    const destinationsByContinent = await prisma.destination.groupBy({
      by: ['continent'],
      _count: { id: true },
    });

    res.status(200).json({
      success: true,
      data: {
        stats: {
          destinations,
          hotels,
          restaurants,
          packages,
          activities,
          articles,
          users,
          submissions,
          unreadSubmissions,
          destinationsByContinent,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 2. DESTINATIONS & SUB-ENTITIES CRUD
// ==========================================
export const getAdminDestinations = async (req, res, next) => {
  try {
    const destinations = await prisma.destination.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        images: true,
        attractions: true,
        hotels: true,
        restaurants: true,
        transportOptions: true,
        _count: {
          select: {
            attractions: true,
            hotels: true,
            restaurants: true,
            transportOptions: true,
            wishlistedBy: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: { destinations },
    });
  } catch (error) {
    next(error);
  }
};

export const createDestination = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      country,
      continent,
      tagline,
      description,
      bestTimeToVisit,
      avgBudgetMin,
      avgBudgetMax,
      currency = 'USD',
      latitude,
      longitude,
      imageUrl,
    } = req.body;

    if (!name || !country || !continent || !description) {
      return next(new AppError('Please provide name, country, continent, and description.', 400));
    }

    const generatedSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const destination = await prisma.destination.create({
      data: {
        name,
        slug: generatedSlug,
        country,
        continent,
        tagline,
        description,
        bestTimeToVisit,
        avgBudgetMin: avgBudgetMin ? parseInt(avgBudgetMin, 10) : null,
        avgBudgetMax: avgBudgetMax ? parseInt(avgBudgetMax, 10) : null,
        currency,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        ...(imageUrl && {
          images: {
            create: [{ url: imageUrl, altText: name }],
          },
        }),
      },
      include: {
        images: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Destination created successfully.',
      data: { destination },
    });
  } catch (error) {
    next(error);
  }
};

export const updateDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      country,
      continent,
      tagline,
      description,
      bestTimeToVisit,
      avgBudgetMin,
      avgBudgetMax,
      currency,
      latitude,
      longitude,
      isPublished,
    } = req.body;

    const destination = await prisma.destination.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(country && { country }),
        ...(continent && { continent }),
        ...(tagline !== undefined && { tagline }),
        ...(description && { description }),
        ...(bestTimeToVisit !== undefined && { bestTimeToVisit }),
        ...(avgBudgetMin !== undefined && { avgBudgetMin: parseInt(avgBudgetMin, 10) }),
        ...(avgBudgetMax !== undefined && { avgBudgetMax: parseInt(avgBudgetMax, 10) }),
        ...(currency && { currency }),
        ...(latitude !== undefined && { latitude: latitude ? parseFloat(latitude) : null }),
        ...(longitude !== undefined && { longitude: longitude ? parseFloat(longitude) : null }),
        ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
      },
      include: {
        images: true,
        attractions: true,
        hotels: true,
        restaurants: true,
        transportOptions: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Destination updated successfully.',
      data: { destination },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.destination.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Destination deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// Destination Sub-Entities: Attractions
export const createAttraction = async (req, res, next) => {
  try {
    const { destinationId, name, description, category, imageUrl } = req.body;
    if (!destinationId || !name) {
      return next(new AppError('Destination ID and Attraction Name are required.', 400));
    }

    const attraction = await prisma.attraction.create({
      data: {
        destinationId,
        name,
        description,
        category: category || 'culture',
        imageUrl,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Attraction added successfully.',
      data: { attraction },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAttraction = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.attraction.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Attraction removed.' });
  } catch (error) {
    next(error);
  }
};

// Destination Sub-Entities: Transport
export const createTransportOption = async (req, res, next) => {
  try {
    const { destinationId, type, description, estCost, currency = 'USD' } = req.body;
    if (!destinationId || !type) {
      return next(new AppError('Destination ID and Transport Type are required.', 400));
    }

    const transport = await prisma.transportOption.create({
      data: {
        destinationId,
        type,
        description,
        estCost: estCost ? parseInt(estCost, 10) : null,
        currency,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Transport option added.',
      data: { transport },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTransportOption = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.transportOption.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Transport option removed.' });
  } catch (error) {
    next(error);
  }
};

// Destination Sub-Entities: Images
export const addDestinationImage = async (req, res, next) => {
  try {
    const { destinationId, url, altText } = req.body;
    if (!destinationId || !url) {
      return next(new AppError('Destination ID and Image URL are required.', 400));
    }

    const image = await prisma.destinationImage.create({
      data: { destinationId, url, altText },
    });

    res.status(201).json({
      success: true,
      message: 'Image added to destination.',
      data: { image },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDestinationImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.destinationImage.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Image deleted.' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 3. HOTELS & ACCOMMODATIONS CRUD
// ==========================================
export const createHotel = async (req, res, next) => {
  try {
    const { destinationId, name, description, starRating, pricePerNight, currency = 'USD', imageUrl, amenities } = req.body;

    if (!destinationId || !name) {
      return next(new AppError('Destination ID and Hotel Name are required.', 400));
    }

    const hotel = await prisma.hotel.create({
      data: {
        destinationId,
        name,
        description,
        starRating: starRating ? parseInt(starRating, 10) : 4,
        pricePerNight: pricePerNight ? parseInt(pricePerNight, 10) : null,
        currency,
        imageUrl,
        amenities: typeof amenities === 'string' ? amenities : JSON.stringify(amenities || []),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Hotel added successfully.',
      data: { hotel },
    });
  } catch (error) {
    next(error);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, starRating, pricePerNight, currency, imageUrl, amenities, destinationId } = req.body;

    const updated = await prisma.hotel.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(starRating && { starRating: parseInt(starRating, 10) }),
        ...(pricePerNight !== undefined && { pricePerNight: parseInt(pricePerNight, 10) }),
        ...(currency && { currency }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(destinationId && { destinationId }),
        ...(amenities !== undefined && {
          amenities: typeof amenities === 'string' ? amenities : JSON.stringify(amenities || []),
        }),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Hotel updated successfully.',
      data: { hotel: updated },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.hotel.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Hotel deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 4. RESTAURANTS & DINING CRUD
// ==========================================
export const getAdminRestaurants = async (req, res, next) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      orderBy: { name: 'asc' },
      include: {
        destination: {
          select: { id: true, name: true, country: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: { restaurants },
    });
  } catch (error) {
    next(error);
  }
};

export const createRestaurant = async (req, res, next) => {
  try {
    const { destinationId, name, cuisine, priceRange = '$$', imageUrl } = req.body;
    if (!destinationId || !name) {
      return next(new AppError('Destination ID and Restaurant Name are required.', 400));
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        destinationId,
        name,
        cuisine,
        priceRange,
        imageUrl,
      },
      include: {
        destination: { select: { name: true, country: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Restaurant added successfully.',
      data: { restaurant },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.restaurant.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Restaurant deleted.' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 5. TOUR PACKAGES CRUD
// ==========================================
export const createPackage = async (req, res, next) => {
  try {
    const { title, slug, summary, durationDays, priceMin, priceMax, currency = 'USD', imageUrl, itinerary } = req.body;

    if (!title || !durationDays) {
      return next(new AppError('Package Title and Duration (in days) are required.', 400));
    }

    const generatedSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const pkg = await prisma.package.create({
      data: {
        title,
        slug: generatedSlug,
        summary,
        durationDays: parseInt(durationDays, 10),
        priceMin: priceMin ? parseInt(priceMin, 10) : null,
        priceMax: priceMax ? parseInt(priceMax, 10) : null,
        currency,
        imageUrl,
        itinerary: typeof itinerary === 'string' ? itinerary : JSON.stringify(itinerary || []),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Package created successfully.',
      data: { package: pkg },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, slug, summary, durationDays, priceMin, priceMax, currency, imageUrl, itinerary, isPublished } = req.body;

    const updated = await prisma.package.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(summary !== undefined && { summary }),
        ...(durationDays && { durationDays: parseInt(durationDays, 10) }),
        ...(priceMin !== undefined && { priceMin: parseInt(priceMin, 10) }),
        ...(priceMax !== undefined && { priceMax: parseInt(priceMax, 10) }),
        ...(currency && { currency }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
        ...(itinerary !== undefined && {
          itinerary: typeof itinerary === 'string' ? itinerary : JSON.stringify(itinerary || []),
        }),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Package updated successfully.',
      data: { package: updated },
    });
  } catch (error) {
    next(error);
  }
};

export const deletePackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.package.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Package deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 6. ACTIVITIES CRUD
// ==========================================
export const getAdminActivities = async (req, res, next) => {
  try {
    const activities = await prisma.activity.findMany({
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

export const createActivity = async (req, res, next) => {
  try {
    const { name, category, description, durationHrs, difficulty = 'easy', imageUrl, destinationId } = req.body;

    if (!name) {
      return next(new AppError('Activity Name is required.', 400));
    }

    const activity = await prisma.activity.create({
      data: {
        name,
        category: category || 'adventure',
        description,
        durationHrs: durationHrs ? parseFloat(durationHrs) : 3.0,
        difficulty,
        imageUrl,
        destinationId: destinationId || null,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Activity created successfully.',
      data: { activity },
    });
  } catch (error) {
    next(error);
  }
};

export const updateActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, description, durationHrs, difficulty, imageUrl, destinationId } = req.body;

    const updated = await prisma.activity.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(description !== undefined && { description }),
        ...(durationHrs !== undefined && { durationHrs: parseFloat(durationHrs) }),
        ...(difficulty && { difficulty }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(destinationId !== undefined && { destinationId }),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Activity updated successfully.',
      data: { activity: updated },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.activity.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Activity deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 7. TRAVEL GUIDE ARTICLES CRUD
// ==========================================
export const getAdminArticles = async (req, res, next) => {
  try {
    const articles = await prisma.guideArticle.findMany({
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

export const createArticle = async (req, res, next) => {
  try {
    const { title, slug, coverImage, content, category, isPublished = true } = req.body;

    if (!title || !content) {
      return next(new AppError('Title and Content are required.', 400));
    }

    const generatedSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const article = await prisma.guideArticle.create({
      data: {
        title,
        slug: generatedSlug,
        coverImage,
        content,
        category: category || 'tips',
        isPublished: Boolean(isPublished),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Article published successfully.',
      data: { article },
    });
  } catch (error) {
    next(error);
  }
};

export const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, slug, coverImage, content, category, isPublished } = req.body;

    const updated = await prisma.guideArticle.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(coverImage !== undefined && { coverImage }),
        ...(content !== undefined && { content }),
        ...(category && { category }),
        ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Article updated successfully.',
      data: { article: updated },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.guideArticle.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Article deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 8. CONTACT INQUIRIES
// ==========================================
export const getAdminSubmissions = async (req, res, next) => {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: { submissions },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleSubmissionRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const current = await prisma.contactSubmission.findUnique({ where: { id } });

    if (!current) {
      return next(new AppError('Submission not found.', 404));
    }

    const updated = await prisma.contactSubmission.update({
      where: { id },
      data: { isRead: !current.isRead },
    });

    res.status(200).json({
      success: true,
      data: { submission: updated },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.contactSubmission.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Submission deleted.' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 9. USERS & RBAC MANAGEMENT
// ==========================================
export const getAdminUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: { wishlist: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      return next(new AppError('Invalid role. Role must be USER or ADMIN.', 400));
    }

    // Prevent demoting oneself
    if (req.user.id === id && role !== 'ADMIN') {
      return next(new AppError('You cannot revoke your own administrator privileges.', 400));
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}.`,
      data: { user: updated },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id === id) {
      return next(new AppError('You cannot delete your own account while logged in.', 400));
    }

    await prisma.user.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'User account removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};
