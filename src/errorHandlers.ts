import { Response } from 'express';

export function hostErrorHandler(err: any) {
  console.log('Express error:', err);
  if (err?.stack) console.log(err.stack);
}

export function requestErrorHandler(res: Response) {
  return res.status(500).json('Server unavailable');
}
