import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { insertContactSchema } from '@shared/schema';
import { ZodError } from 'zod';
import { storage } from './storage';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  return res.status(500).json({ success: false, error: 'Internal server error' });
});

// Set up server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});

// Contact form submission endpoint
app.post('/contact', async (req: Request, res: Response) => {
  try {
    console.log('📩 Received contact form submission:', req.body);

    // Validate the incoming request data
    const contactData = insertContactSchema.parse(req.body);

    // Log the validated data
    console.log('📩 Validated Contact Data:', contactData);

    // Save the contact message to storage (e.g., a database)
    await storage.createContactMessage(contactData);

    // ✅ Response without sending email
    return res.status(200).json({
      success: true,
      message: 'Message received successfully. No email sent.',
    });
  } catch (error) {
    console.error('❌ Error in contact submission:', error);

    // Handle validation errors
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: `Validation error: ${error.errors.map((err) => err.message).join(', ')}`,
      });
    }

    // Handle other types of errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred.';
    return res.status(500).json({ success: false, error: errorMessage });
  }
});
