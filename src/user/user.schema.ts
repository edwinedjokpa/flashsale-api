import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.index({ firstName: 1 });
userSchema.index({ lastName: 1 });
userSchema.index({ firstName: 1, lastName: 1 });

userSchema.index({ email: 1, password: 1 });

const User = model<IUser>('User', userSchema);

export default User;
