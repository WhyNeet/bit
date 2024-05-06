export class CreateUserDto {
	email: string;

	username: string;

	password: string;

	name: string;
}

export class UserCredentialsDto {
	email: string;

	password: string;
}

export class UserDto {
	id: string;
	email: string;
	username: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}
