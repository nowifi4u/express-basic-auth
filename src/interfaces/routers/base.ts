import { Router } from 'express';

export type IRouters<T> = { [key in keyof T]: Router };
