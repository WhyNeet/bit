import { User } from "./user.entity";

export class Community {
  id: string;
  name: string;
  description?: string;

  owner: User | string;
  members: number;

  createdAt: Date;
  updatedAt: Date;
}
