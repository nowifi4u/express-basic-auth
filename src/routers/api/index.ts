import { RouterCombine } from '#src/routers/base';

const routers = {
  '/auth': (await import('./auth')).default,
  '/user': (await import('./user')).default,
};

const router = RouterCombine(routers);
router.get('/', (_req, res) => {
  res.json({ message: 'hello from /api' });
});

export default router;
