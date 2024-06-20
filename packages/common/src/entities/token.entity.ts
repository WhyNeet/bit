export enum TokenType {
  AccessToken = "access_token",
  RefreshToken = "refresh_token",
}

export class Token {
  id: string;
  expireAt: Date;
}
