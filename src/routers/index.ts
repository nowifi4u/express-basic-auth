import { RouterCombine } from '#src/routers/base';

const routers = {
  '/api': (await import('./api/index')).default,
};

const router = RouterCombine(routers);

router.all('*', (_req, res) => {
  res.status(404).json(404);
});

export default router;
