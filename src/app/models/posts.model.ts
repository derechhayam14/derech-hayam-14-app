import { User } from "../auth/user.model";

export interface Posts {
  id?: string;
  title: string;
  description: string;
  status?: string;
  date?: Date;
  user?: User
}
