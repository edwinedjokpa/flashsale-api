import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
  uuid: string;
  email: string;
  password: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

const userSchema = new Schema<IUser>(
  {
    uuid: { type: String, default: () => crypto.randomUUID() },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarUrl: { type: String, required: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const User = model<IUser>('User', userSchema);

export default User;
