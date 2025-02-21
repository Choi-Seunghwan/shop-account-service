import { ConfigService } from '@nestjs/config';

export class VerificationService {
  constructor(private readonly configService: ConfigService) {}

  async identityVerification(identityVerificationId: string) {
    const url = `https://api.portone.io/identity-verifications/${encodeURIComponent(identityVerificationId)}`;

    const verificationResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `PortOne ${this.configService.getOrThrow('PORTONE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!verificationResponse.ok) {
      throw new Error(
        `Error: ${verificationResponse.status} ${verificationResponse.statusText}`,
      );
    }

    return verificationResponse.json(); // JSON 응답을 파싱하여 반환
  }
}
