import { RequestBody } from '#src/interfaces/routers/index';
import { NextFunction, Request, Response, Router } from 'express';
import { db } from '#src/connector';
import { hostErrorHandler, requestErrorHandler } from '#src/errorHandlers';
import { validationResult } from 'express-validator';
import * as bcrypt from 'bcrypt';
import sequelize from 'sequelize';

import { generate as bcryptGenerate } from '#src/services/bcrypt';
import { generate as jwtGenerate, authentificator } from '#src/services/jwt';

import { validatePassword } from '#src/config/validators';
import { IUserAuth } from '#src/models/userAuth';

const router = Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.put('/', [validatePassword], async (req: Request, res: Response) => {
  try {
    if (!validationResult(req).isEmpty()) {
      return res.status(400).json('Request password must be at least 8 characters long!');
    }

    const { email, firstName, lastName, password }: RequestBody = req.body;

    try {
      await db.User.build({ email, firstName, lastName }).validate({ fields: ['email', 'firstName', 'lastName'] });
    } catch (err: any) {
      const fields: string = err.errors.map((e: any) => e.path).join(',');
      return res.status(400).json({ message: `Invalid request: Field ${fields} must be set!` });
    }

    {
      const existingUser = await db.UserAuth.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User with email already exists!' });
      }
    }

    const hashPassword = bcryptGenerate(password);

    // @ts-expect-error
    const newUser = new db.User({ email, password: hashPassword, firstName, lastName });
    await newUser.save();

    return res.json({ message: 'ok' });
  } catch (err) {
    hostErrorHandler(err);
    return requestErrorHandler(res);
  }
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/', [validatePassword], async (req: Request, res: Response) => {
  try {
    if (!validationResult(req).isEmpty()) {
      return res.status(400).json({ message: 'Invalid request: Fields password are invalid!' });
    }

    const { email, password }: RequestBody = req.body;

    try {
      await db.UserAuth.build({ email }).validate({ fields: ['email'] });
    } catch (err: any) {
      const fields: string = err.errors.map((e: any) => e.path).join(',');
      return res.status(400).json({ message: `Invalid request: Fields ${fields} are invalid!` });
    }

    const user: IUserAuth | null = (await db.UserAuth.findOne({ where: { email } })) as any;
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: `Invalid email or password` });
    }

    const token = jwtGenerate(user);
    return res.json({ token });
  } catch (err) {
    hostErrorHandler(err);
    return requestErrorHandler(res);
  }
});

router.get('/', [authentificator], async (req: Request, res: Response, next: NextFunction) => {
  try {
    if ('email' in req.body) {
      return next();
    }

    // @ts-expect-error
    const userid: string = req.user.id;

    const userData = await db.UserData.findByPk(userid);
    return res.json(userData);
  } catch (err) {
    hostErrorHandler(err);
    return requestErrorHandler(res);
  }
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', async (req: Request, res: Response) => {
  const email = req.body.email;

  try {
    await db.UserData.build({ email }).validate({ fields: ['email'] });
  } catch (err) {
    return res.status(400).json({ message: `Invalid request: Fields email are invalid!` });
  }

  const userData = await db.UserData.findOne({ where: { email } });

  if (!userData) return res.status(404).json({ message: `Email "${String(email)}" not found!` });
  return res.json(userData);
});

router.delete('/', [authentificator], async (req: Request, res: Response) => {
  try {
    // @ts-expect-error
    await req.user.destroy();
    return res.json({ message: 'ok' });
  } catch (err) {
    hostErrorHandler(err);
    return requestErrorHandler(res);
  }
});

router.patch('/', [authentificator, validatePassword], async (req: Request, res: Response) => {
  try {
    // @ts-expect-error
    const userid: string = req.user.id;

    const patches: any = {};

    for (const key of ['email', 'firstName', 'lastName']) {
      if (req.body[key]) patches[key] = req.body[key];
    }

    {
      const keys = Object.keys(patches);
      try {
        if (keys.length) await db.UserData.build(patches).validate({ fields: keys });
      } catch (err: any) {
        const fields: string = err.errors.map((e: any) => e.path).join(',');
        return res.status(400).json({ message: `Invalid request: Fields ${fields} are invalid!` });
      }
    }

    if (req.body.password) {
      if (!validationResult(req).isEmpty()) {
        return res.status(400).json('Invalid request: Fields password are invalid!');
      }
      patches.passwordAt = sequelize.fn('now');
      patches.password = bcryptGenerate(req.body.password);
    }

    if (!Object.keys(patches).length) {
      return res.status(400).json({ message: 'Invalid request: Fields are not specified' });
    }

    await db.User.update(patches, { where: { id: userid } });
    return res.json({ message: 'ok' });
  } catch (err) {
    hostErrorHandler(err);
    return requestErrorHandler(res);
  }
});

export default router;
