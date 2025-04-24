import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name, country } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      country,
      subscription: {
        package: 'Basic',
        amount: 0,
        startDate: new Date(),
      },
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        country: user.country,
        subscription: user.subscription,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        country: user.country,
        subscription: user.subscription,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // In a real implementation, you might want to blacklist the token
    // For now, we'll just send a success response as the client will remove the token
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error logging out', error: error.message });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        country: user.country,
        subscription: user.subscription,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
}; 