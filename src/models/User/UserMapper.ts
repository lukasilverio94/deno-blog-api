import { IUser } from "./IUser.ts";

export interface PublicUser {
  id: string;
  username: string;
  bio?: string;
  avatar?: string;
}

export function toPublicUser(user: IUser): PublicUser {
  if (!user._id) {
    throw new Error("Persisted user does not have an ID");
  }

  return {
    id: user._id.toString(),
    username: user.username,
    bio: user.bio,
    avatar: user.avatar,
  };
}
