import { ConfigService } from '@nestjs/config';
import { IdentityVerificationResponse } from './types/verification.type';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class VerificationService {
  constructor(private readonly configService: ConfigService) {}

  async identityVerification(identityVerificationId: string): Promise<IdentityVerificationResponse> {
    const url = `https://api.portone.io/identity-verifications/${encodeURIComponent(identityVerificationId)}/?storeId=${this.configService.getOrThrow('PORTONE_STORE_ID')}`;

    const verificationResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `PortOne ${this.configService.getOrThrow('PORTONE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!verificationResponse.ok) {
      throw new UnauthorizedException(`Error: ${verificationResponse.status} ${verificationResponse.statusText}`);
    }

    const verificationData: IdentityVerificationResponse = await verificationResponse.json();
    return verificationData;
  }
}
