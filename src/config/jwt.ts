import { SignOptions } from 'jsonwebtoken';

/* eslint-disable @typescript-eslint/no-inferrable-types */
export const secret: string = '';
export const options: SignOptions | undefined = { expiresIn: '24h' };
