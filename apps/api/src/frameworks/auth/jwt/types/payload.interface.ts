export interface JwtPayload {
	sub: string;
	jti: string;
	exp: number;
}

export interface JwtCreatePayload {
	sub: string;
	jti: string;
	exp?: number;
}
