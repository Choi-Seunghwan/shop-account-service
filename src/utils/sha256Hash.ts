import * as crypto from 'crypto';

export const sha256Hash = (value: string): string => {
  return crypto.createHash('sha256').update(value).digest('hex');
};
