export class CreateUserDto {
  email: string;

  username: string;

  password: string;

  name: string;

  constructor(email: string, username: string, password: string, name: string) {
    this.email = email;
    this.username = username;
    this.password = password;
    this.name = name;
  }
}

export class UserCredentialsDto {
  email: string;

  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export class UserDto {
  id: string;
  email: string;
  username: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
