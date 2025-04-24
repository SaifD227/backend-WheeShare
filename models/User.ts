import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  country: string;
  subscription: {
    package: 'Basic' | 'Standard' | 'Premium' | 'Startup';
    amount: number;
    startDate: Date;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
  },
  subscription: {
    package: {
      type: String,
      enum: ['Basic', 'Standard', 'Premium', 'Startup'],
      default: 'Basic',
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
  },
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function(this: IUser, next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    const password = this.password as string;
    this.password = await bcrypt.hash(password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema); 