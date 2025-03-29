import { IsString } from 'class-validator';

export class CheckDuplicateCiDto {
  @IsString()
  identityVerificationId: string;
}
