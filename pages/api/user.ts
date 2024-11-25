import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import User from '@/models/User';  // Assuming your User model is in `models/User.ts`
import dbConnect from '@/lib/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests to this endpoint
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Get the token from the Authorization header (Bearer token)
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token is missing' });
  }

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string; name: string };

    // Connect to the database
    await dbConnect();

    // Fetch user from the database using the email stored in the decoded JWT token
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user data (excluding password or any other sensitive information)
    return res.status(200).json({ user: { name: user.name, email: user.email, image: user.image } });
  } catch (error) {
    // Handle specific error for token expiration
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token has expired. Please log in again.' });
    }

    // Handle other JWT errors
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
