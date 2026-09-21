import { Router } from 'express';
import {
  getAdminStats,
  // Destinations & Sub-Entities
  getAdminDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
  createAttraction,
  deleteAttraction,
  createTransportOption,
  deleteTransportOption,
  addDestinationImage,
  deleteDestinationImage,
  // Hotels
  createHotel,
  updateHotel,
  deleteHotel,
  // Restaurants
  getAdminRestaurants,
  createRestaurant,
  deleteRestaurant,
  // Packages
  createPackage,
  updatePackage,
  deletePackage,
  // Activities
  getAdminActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  // Articles
  getAdminArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  // Inquiries
  getAdminSubmissions,
  toggleSubmissionRead,
  deleteSubmission,
  // Users
  getAdminUsers,
  updateUserRole,
  deleteUser,
} from './admin.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

// Protect all routes with JWT and ADMIN role
router.use(authenticate);
router.use(authorize(['ADMIN']));

// 1. Stats
router.get('/stats', getAdminStats);

// 2. Destinations & Sub-Entities
router.get('/destinations', getAdminDestinations);
router.post('/destinations', createDestination);
router.put('/destinations/:id', updateDestination);
router.delete('/destinations/:id', deleteDestination);

router.post('/attractions', createAttraction);
router.delete('/attractions/:id', deleteAttraction);

router.post('/transport', createTransportOption);
router.delete('/transport/:id', deleteTransportOption);

router.post('/destination-images', addDestinationImage);
router.delete('/destination-images/:id', deleteDestinationImage);

// 3. Hotels
router.post('/hotels', createHotel);
router.put('/hotels/:id', updateHotel);
router.delete('/hotels/:id', deleteHotel);

// 4. Restaurants
router.get('/restaurants', getAdminRestaurants);
router.post('/restaurants', createRestaurant);
router.delete('/restaurants/:id', deleteRestaurant);

// 5. Packages
router.post('/packages', createPackage);
router.put('/packages/:id', updatePackage);
router.delete('/packages/:id', deletePackage);

// 6. Activities
router.get('/activities', getAdminActivities);
router.post('/activities', createActivity);
router.put('/activities/:id', updateActivity);
router.delete('/activities/:id', deleteActivity);

// 7. Travel Guide Articles
router.get('/guide', getAdminArticles);
router.post('/guide', createArticle);
router.put('/guide/:id', updateArticle);
router.delete('/guide/:id', deleteArticle);

// 8. Contact Submissions
router.get('/contact-submissions', getAdminSubmissions);
router.patch('/contact-submissions/:id/toggle-read', toggleSubmissionRead);
router.delete('/contact-submissions/:id', deleteSubmission);

// 9. Users & Roles
router.get('/users', getAdminUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
