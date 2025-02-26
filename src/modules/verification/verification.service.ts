import { ConfigService } from '@nestjs/config';
import { IdentityVerificationResponse } from './types/verification.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationService {
  constructor(private readonly configService: ConfigService) {}

  async identityVerification(identityVerificationId: string): Promise<IdentityVerificationResponse> {
    const url = `https://api.portone.io/identity-verifications/${encodeURIComponent(identityVerificationId)}`;

    const verificationResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `PortOne ${this.configService.getOrThrow('PORTONE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!verificationResponse.ok) {
      throw new Error(`Error: ${verificationResponse.status} ${verificationResponse.statusText}`);
    }

    const verificationData: IdentityVerificationResponse = await verificationResponse.json();
    return verificationData;
  }
}
