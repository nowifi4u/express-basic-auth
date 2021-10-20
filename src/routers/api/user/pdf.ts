import { Request, Response, Router } from 'express';
import { db } from '#src/connector';
import { hostErrorHandler, requestErrorHandler } from '#src/errorHandlers';

import { authentificator } from '#src/services/jwt';

import * as pdf from '#src/services/pdf';
import { IUser } from '#src/models/user';

const router = Router();

router.get('/', [authentificator], async (req: Request, res: Response) => {
  try {
    if ('email' in req.body) {
      const email = req.body.email;

      if (typeof email !== 'string') {
        return res.status(400).json({ message: 'Invalid query type' });
      }

      try {
        await db.UserData.build({ email }).validate({ fields: ['email'] });
      } catch (err) {
        return res.status(400).json({ message: `Invalid request: Fields email are invalid!` });
      }

      const userPdf = await db.UserPdf.findOne({ where: { email } });

      if (!userPdf) return res.status(404).json({ message: `Email "${email}" not found!` });
      // @ts-expect-error
      return res.json({ pdf: userPdf.pdf?.toString('base64') ?? null });
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
