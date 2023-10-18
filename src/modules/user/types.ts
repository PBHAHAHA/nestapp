export interface UserConfig {
    hash?: number;
    jwt: JwtConfig;
}

export interface JwtConfig {
    secret: string;
    token_expired: number;
    refresh_secret: string;
    refresh_token_expired: number;
}

export interface JwtPayload {
    sub: string;
    iat: number;
}
