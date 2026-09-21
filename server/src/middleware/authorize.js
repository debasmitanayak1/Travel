import { AppError } from './errorHandler.js';

export const authorize = (allowedRoles = ['ADMIN']) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('You are not authenticated.', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Access denied. Administrator privileges required.', 403));
    }

    next();
  };
};
