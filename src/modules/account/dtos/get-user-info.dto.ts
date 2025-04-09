import { IsNumber } from 'class-validator';

export class GetUserInfoDto {
  @IsNumber()
  accountId: number;
}
