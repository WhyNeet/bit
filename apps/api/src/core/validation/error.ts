// biome-ignore lint/complexity/noStaticOnlyClass: value grouping
export class ValidationError {
  public static readonly MustBeAString = () => "must be a string";
  public static readonly InvalidEmail = () => "invalid email";
  public static readonly InvalidUsername = () => "invalid username";
  public static readonly BadPasswordLength = () =>
    "password must be 8 - 72 characters long";
  public static readonly MustBeBetweenChars = (min: number, max: number) =>
    `must be between ${min} and ${max} characters long`;
  public static readonly MustBeAtLeastChars = (min: number) =>
    `must be at least ${min} characters long`;
  public static readonly MustBeAnObjectId = () => "must be a valid object id";
  public static readonly MustBeAFile = () => "must be a file";
  public static readonly MaxFileSizeExceeded = () =>
    "must be at most 3mb in size";
  public static readonly InvalidMimeType = (correct: string) =>
    `must be of type "${correct}"`;
  public static readonly TooManyFiles = (max: number) =>
    `at most ${max} files can be uploaded`;
  public static readonly InvalidCommunityName = () => "invalid community name";
}
