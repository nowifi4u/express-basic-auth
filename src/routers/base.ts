import { Router } from 'express';
import { IRouters } from '#src/interfaces/routers/base';

export function RouterCombine<T>(routers: IRouters<T>): Router {
  const r = Router();

  // eslint-disable-next-line guard-for-in
  for (const routerPath in routers) {
    r.use(routerPath, routers[routerPath]);
  }

  return r;
}
