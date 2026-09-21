import { prisma } from '../../config/db.js';
import { AppError } from '../../middleware/errorHandler.js';

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return next(new AppError('Please provide name, email, and message.', 400));
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email: email.toLowerCase(),
        subject: subject || 'General Inquiry',
        message,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received and our team will get in touch soon.',
      data: { submissionId: submission.id },
    });
  } catch (error) {
    next(error);
  }
};
