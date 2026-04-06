import api from './axios';
import { setSessionAccessToken } from './session-access-token';

/** @agro/shared-backend user_roles + JWT primary role */
export type AuthUserRole =
  | 'admin'
  | 'editor'
  | 'carrier'
  | 'customer'
  | 'dealer'
  /** eski DB uyumu */
  | 'moderator'
  | 'user';

export type AuthUser = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  email_verified: number;
  is_active: number;
  role: AuthUserRole;
};

type AuthResponse = {
  access_token: string;
  token_type: string;
  user: AuthUser;
};

/** Email/password login */
export async function loginWithEmail(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await api.post('/auth/token', {
    grant_type: 'password',
    email,
    password,
  });
  const data = res.data as AuthResponse;
  if (data.access_token) setSessionAccessToken(data.access_token);
  return data;
}

/** Email/password signup */
export async function signupWithEmail(
  email: string,
  password: string,
  fullName?: string,
): Promise<AuthResponse> {
  const res = await api.post('/auth/signup', {
    email,
    password,
    full_name: fullName,
  });
  const data = res.data as AuthResponse;
  if (data.access_token) setSessionAccessToken(data.access_token);
  return data;
}

/** Start Google OAuth redirect flow */
export async function startGoogleOAuth(redirectTo?: string): Promise<void> {
  const res = await api.post('/auth/google/start', {
    redirectTo,
  });
  const { url } = res.data as { url: string };
  window.location.href = url;
}

/** Get current user from cookie-based session */
export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const res = await api.get('/auth/user');
    return res.data?.user ?? res.data ?? null;
  } catch {
    return null;
  }
}

/** Update user profile */
export async function updateProfile(data: {
  full_name?: string;
  phone?: string;
  email?: string;
  password?: string;
}): Promise<AuthUser> {
  const res = await api.put('/auth/user', data);
  return res.data?.user ?? res.data;
}

/** Logout */
export async function logout(): Promise<void> {
  setSessionAccessToken(null);
  try {
    await api.post('/auth/logout');
  } catch {
    // silent
  }
}
