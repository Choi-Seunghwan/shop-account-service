export type IdentityVerificationResponse = {
  status: string;
  id: string;
  channel?: {
    type: string;
    id?: string;
    key?: string;
    name?: string;
    pgProvider: string;
    pgMerchantId: string;
  };
  verifiedCustomer: {
    id: string;
    name: string;
    birthDate: string;
    phoneNumber: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    isForeigner: boolean;
    operator: 'SKT' | 'KT' | 'LGU' | 'SKT_MVNO' | 'KT_MVNO' | 'LGU_MVNO' | 'ETC';
    ci: string;
    di: string;
  };
  customData: string;
  requestedAt: string;
  updatedAt: string;
  statusChangedAt: string;
};
