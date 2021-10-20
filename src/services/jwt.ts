import jwt from 'jsonwebtoken';
import * as options from '#src/config/jwt';

import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { db } from '#src/connector';
import { IUserAuth } from '#src/models/userAuth';

export function cutPassword(pswrd: string): string {
  return pswrd.slice(0, 5);
}

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: options.secret,
    },
    (jwtPayload: any, done) => {
      db.UserAuth.findOne({ where: { id: jwtPayload.id } })
        .then((user: any) => {
          if (jwtPayload.timestamp !== user.password_timestamp.getTime()) return done('Invalid token');
          return done(null, user);
        })
        .catch(err => {
          return done(err);
        });
    },
  ),
);

export function generate(user: IUserAuth): string {
  const payload = {
    id: user.id,
    timestamp: user.password_timestamp.getTime(),
  };
  return jwt.sign(payload, options.secret, options.options);
}

export const authentificator = passport.authenticate('jwt', { session: false });
