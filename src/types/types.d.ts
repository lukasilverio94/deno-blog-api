import { IUser } from './../models/User/IUser.ts';

declare global {
  namespace Express {
    interface Request {
      user: Partial<IUser>;
      userId: string;
    }
  }
}
