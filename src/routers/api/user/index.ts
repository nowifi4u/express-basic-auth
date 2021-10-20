import { RouterCombine } from '#src/routers/base';

const routers = {
  '/image': (await import('./image')).default,
  '/pdf': (await import('./pdf')).default,
};

const router = RouterCombine(routers);
router.get('/', (_req, res) => {
  res.json({ message: 'hello from /api/user' });
});

export default router;
