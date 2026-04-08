import type { FastifyRequest, FastifyReply } from 'fastify';
import { getAuthUserId } from '@agro/shared-backend/modules/_shared';
import type { JwtUser } from '@agro/shared-backend/middleware/auth';
import { repoGetDealerProfile } from '@agro/shared-backend/modules/dealerFinance/repository';

function jwtUser(req: FastifyRequest): JwtUser | undefined {
  return (req as FastifyRequest & { user?: JwtUser }).user;
}

/** Bayi API: admin tam yetki; `dealer` icin `dealer_profiles.is_approved === 1` zorunlu. */
export async function requireApprovedDealer(req: FastifyRequest, reply: FastifyReply) {
  const role = jwtUser(req)?.role;
  if (role === 'admin') return;

  const userId = getAuthUserId(req);
  const profile = await repoGetDealerProfile(userId);
  if (!profile || profile.is_approved !== 1) {
    return reply.code(403).send({ error: { message: 'dealer_not_approved' } });
  }
}
