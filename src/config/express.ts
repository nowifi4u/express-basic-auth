/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IHttpOptions, IHttpsOptions } from '#src/interfaces/config/express';
import { CorsOptions } from 'cors';

export const cors: CorsOptions | undefined = undefined;

export const http: IHttpOptions | undefined = {
  port: 8080,
};

export const https: IHttpsOptions | undefined = undefined;

export const debug: boolean = true;
