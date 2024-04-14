// biome-ignore lint/complexity/noStaticOnlyClass: value grouping
export class ValidationError {
	public static readonly MustBeAString = () => "must be a string";
	public static readonly InvalidEmail = () => "invalid email";
	public static readonly InvalidUsername = () => "invalid username";
	public static readonly BadPasswordLength = () =>
		"password must be 8 - 72 characters long";
}
