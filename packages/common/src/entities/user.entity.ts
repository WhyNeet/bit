export class User {
  id: string;
  email: string;
  username: string;
  name: string;
  bio?: string;
  password: string;
  followers: number;
  createdAt: Date;
  updatedAt: Date;
}
