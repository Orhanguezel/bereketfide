import api from './axios';

export type AuthUser = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  email_verified: number;
  is_active: number;
  role: 'admin' | 'moderator' | 'user';
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
  return res.data;
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
  return res.data;
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
  try {
    await api.post('/auth/logout');
  } catch {
    // silent
  }
}
