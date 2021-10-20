export interface IHttpOptions {
  port: number;
}

export interface IHttpsCredentils {
  key: string;
  cert: string;
}

export interface IHttpsOptions {
  port: number;
  credentials: IHttpsCredentils;
}
