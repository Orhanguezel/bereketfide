import { sendBereketMail } from '@/core/bereket-mail';

export async function sendMailRaw(input: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<void> {
  await sendBereketMail(input);
}
