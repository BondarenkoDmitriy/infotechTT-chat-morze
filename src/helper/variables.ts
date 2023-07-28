import { User } from "../types/user";

export const isAuthorizedUser = (username: string, users: User[]) => {
  return users.some((user) => user.username === username);
};

export const getUserByName = (username: string, users: User[]) => {
 return users.find((user) => user.username === username);
};
