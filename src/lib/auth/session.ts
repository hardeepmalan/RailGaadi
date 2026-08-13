import { getServerSession } from 'next-auth';
import { authOptions, isAuthorizedAdmin } from './options';
import { NextResponse } from 'next/server';

export async function getServerAuthSession() {
  return await getServerSession(authOptions);
}

export async function requireUserSession() {
  const session = await getServerAuthSession();
  if (!session || !session.user || !session.user.email) {
    return { session: null, errorResponse: NextResponse.json({ error: 'Authentication required. Please sign in.' }, { status: 401 }) };
  }
  return { session, errorResponse: null };
}

export async function requireAdminSession() {
  const { session, errorResponse } = await requireUserSession();
  if (errorResponse) return { session: null, errorResponse };

  if (session?.user?.role !== 'admin' || !isAuthorizedAdmin(session?.user?.email)) {
    console.warn(`🚨 UNAUTHORIZED ADMIN ACCESS ATTEMPT: User [${session?.user?.email}] tried to access admin route.`);
    return {
      session: null,
      errorResponse: NextResponse.json({ error: 'Access denied: Admin authorization required.' }, { status: 403 })
    };
  }

  return { session, errorResponse: null };
}
