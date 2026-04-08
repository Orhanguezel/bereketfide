import { describe, it, expect } from 'bun:test';
import { dealerPublicRegisterSchema } from '@agro/shared-backend/modules/dealerFinance';

describe('dealerPublicRegisterSchema', () => {
  it('accepts minimal valid payload', () => {
    const r = dealerPublicRegisterSchema.safeParse({
      email: 'a@b.co',
      password: 'secret1',
      full_name: 'Test User',
      phone: '05551234567',
      company_name: 'Test A.Ş.',
      tax_number: '1234567890',
      tax_office: 'Kadıköy',
      rules_accepted: true,
    });
    expect(r.success).toBe(true);
  });

  it('rejects rules_accepted false', () => {
    const r = dealerPublicRegisterSchema.safeParse({
      email: 'a@b.co',
      password: 'secret1',
      full_name: 'Test User',
      phone: '05551234567',
      company_name: 'Test A.Ş.',
      tax_number: '1234567890',
      tax_office: 'Kadıköy',
      rules_accepted: false,
    });
    expect(r.success).toBe(false);
  });

  it('rejects short password', () => {
    const r = dealerPublicRegisterSchema.safeParse({
      email: 'a@b.co',
      password: '12345',
      full_name: 'Test User',
      phone: '05551234567',
      company_name: 'Test A.Ş.',
      tax_number: '1234567890',
      tax_office: 'Kadıköy',
      rules_accepted: true,
    });
    expect(r.success).toBe(false);
  });
});
