import { IModelConstructors } from '#src/interfaces/models';

const _models = {
  User: (await import('./user')).default,
  UserData: (await import('./userData')).default,
  UserAuth: (await import('./userAuth')).default,
  UserImage: (await import('./userImage')).default,
  UserPdf: (await import('./userPdf')).default,
};
export const models: IModelConstructors<typeof _models> = _models;
