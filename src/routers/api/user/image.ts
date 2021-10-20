import { NextFunction, Request, Response, Router } from 'express';
import { db } from '#src/connector';
import { hostErrorHandler, requestErrorHandler } from '#src/errorHandlers';

import { authentificator } from '#src/services/jwt';

import { imageConfig, checkImageSize, multerImage } from '#src/services/image';

const router = Router();

router.get('/', [authentificator], async (req: Request, res: Response, next: NextFunction) => {
  try {
    if ('email' in req.body) {
      return next();
    }

    // @ts-expect-error
    const userid: string = req.user.id;

    const userImage = await db.UserImage.findByPk(userid);
    // @ts-expect-error
    return res.json({ image: userImage.image, imageType: userImage.imageType });
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

    const userImage = await db.UserImage.findOne({ where: { email } });

    if (!userImage) return res.status(404).json({ message: `Email "${String(email)}" not found!` });
    // @ts-expect-error
    return res.json({ pdf: userImage.image, imageType: userImage.imageType });
  } catch (err) {
    hostErrorHandler(err);
    return requestErrorHandler(res);
  }
});

router.delete('/', [authentificator], async (req: Request, res: Response) => {
  try {
    // @ts-expect-error
    const userid: string = req.user.id;

    await db.UserImage.update({ image: null, imageType: null }, { where: { id: userid } });
    return res.json({ message: 'ok' });
  } catch (err) {
    hostErrorHandler(err);
    return requestErrorHandler(res);
  }
});

router.put('/', [authentificator], (req: Request, res: Response) => {
  // @ts-expect-error
  const userid: string = req.user.id;

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  multerImage.single('image')(req, res, async err => {
    try {
      if (err) {
        return res.status(400).json({ message: `Image file size bigger than ${String(imageConfig.maxSize)}` });
      }

      if (!req.file || !req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: `Image file expected, not ${String(req.file?.mimetype)}` });
      }

      if (!checkImageSize(req.file.buffer)) {
        return res.status(400).json({
          message: `Image size too big, max size ${String(imageConfig.maxWidth)}x${String(imageConfig.maxHeight)}`,
        });
      }

      await db.UserImage.update(
        { image: req.file.buffer.toString('base64'), imageType: req.file.mimetype },
        { where: { id: userid } },
      );
      return res.json({ message: 'ok' });
      // eslint-disable-next-line no-catch-shadow
    } catch (err) {
      hostErrorHandler(err);
      return requestErrorHandler(res);
    }
  });
});

export default router;
