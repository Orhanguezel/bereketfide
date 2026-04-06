import api from '@/lib/axios';

export type DealerRegisterPayload = {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  company_name: string;
  tax_number: string;
  tax_office: string;
  city?: string;
  region?: string;
  rules_accepted: true;
};

export async function postDealerRegister(payload: DealerRegisterPayload): Promise<void> {
  await api.post('/dealer/register', payload);
}
