import { UserRole } from "./role";

export interface User {
  username: string;
  role: UserRole;
}