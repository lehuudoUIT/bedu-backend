import { User } from 'src/entities/user.entity';

export type AuthInput = { username: string; password: string };

export type SignInData = Partial<User>;

export type AuthResult = {
  user: Partial<User>;
  accessToken: string;
};

export type LogParam = {
  requestId: string;
  context: string | object;
  metadata: object;
};

export function identifyAction(action: string, type: 'own' | 'any'): string {
  switch (action) {
    case 'create':
      return type === 'any' ? 'createAny' : 'createOwn';
    case 'read':
      return type === 'any' ? 'readAny' : 'readOwn';
    case 'update':
      return type === 'any' ? 'updateAny' : 'updateOwn';
    case 'delete':
      return type === 'any' ? 'deleteAny' : 'deleteOwn';
    default:
      return action;
  }
}

export function filterByProperty<T>(array: T[], propertyName: keyof T): T[] {
  return array.filter((item) => item[propertyName] != null);
}
