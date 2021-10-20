import { Router } from 'express';

export type IRouters<T> = { [key in keyof T]: Router };

export interface RequestBodyOpt {
  [key: string]: string | undefined;
}
export interface RequestBody {
  [key: string]: string;
}
