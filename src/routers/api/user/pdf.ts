import { NextFunction, Request, Response, Router } from 'express';
import { db } from '#src/connector';
import { hostErrorHandler, requestErrorHandler } from '#src/errorHandlers';

import { authentificator } from '#src/services/jwt';

import * as pdf from '#src/services/pdf';
import { IUser } from '#src/models/user';

const router = Router();

router.get('/', [authentificator], async (req: Request, res: Response, next: NextFunction) => {
  try {
    if ('email' in req.body) {
      return next();
    }

    // @ts-expect-error
    const userid: string = req.user.id;

    const userPdf = await db.UserPdf.findByPk(userid);
    // @ts-expect-error
    return res.json({ pdf: userPdf.pdf?.toString('base64') ?? null });
  } catch (err) {
    hostErrorHandler(err);
    return requestErrorHandler(res);
  }
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', async (req: Request, res: Response) => {
  try {
    const email = req.body.email;

    try {
      await db.UserData.build({ email }).validate({ fields: ['email'] });
    } catch (err) {
      return res.status(400).json({ message: `Invalid request: Fields email are invalid!` });
    }

    const userPdf = await db.UserPdf.findOne({ where: { email } });

    if (!userPdf) return res.status(404).json({ message: `Email "${String(email)}" not found!` });
    // @ts-expect-error
    return res.json({ pdf: userPdf.pdf?.toString('base64') ?? null });
  } catch (err) {
    hostErrorHandler(err);
    return requestErrorHandler(res);
  }
});

router.delete('/', [authentificator], async (req: Request, res: Response) => {
  try {
    // @ts-expect-error
    const userid: string = req.user.id;

    await db.UserPdf.update({ pdf: null }, { where: { id: userid } });
    return res.json({ message: 'ok' });
  } catch (err) {
    hostErrorHandler(err);
    return requestErrorHandler(res);
  }
});

router.post('/generate', [authentificator], async (req: Request, res: Response) => {
  try {
    // @ts-expect-error
    const userid: string = req.user.id;

    const user: IUser = (await db.User.findByPk(userid)) as any;

    const content = await pdf.generate(user);

    await db.UserPdf.update({ pdf: Buffer.from(content, 'base64') }, { where: { id: userid } });

    return res.json({ message: 'ok' });
  } catch (err) {
    hostErrorHandler(err);
    return requestErrorHandler(res);
  }
});

export default router;
