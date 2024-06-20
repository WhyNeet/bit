import { UserDto } from "./user.dto";

export class CreateCommunityDto {
  name: string;
  description?: string;
}

export class UpdateCommunityDto {
  name: string;
  description?: string;
}

export class CommunityDto {
  id: string;
  name: string;
  description?: string;
  owner: UserDto | string;
  members: number;
  createdAt: Date;
  updatedAt: Date;
}
