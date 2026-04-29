import { redirect } from '@sveltejs/kit';
import { clearSessionCookie } from '$lib/server/auth';
import { deleteSession, getDb } from '$lib/server/db';
import { SESSION_COOKIE } from '$lib/server/constants';

export const GET = async ({ cookies, platform }) => {
	const token = cookies.get(SESSION_COOKIE);
	if (token) await deleteSession(getDb(platform), token);
	clearSessionCookie(cookies);
	throw redirect(303, '/auth/sign-in');
};
