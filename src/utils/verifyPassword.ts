import * as argon2 from 'argon2';

export const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await argon2.verify(hashedPassword, plainPassword);
};
