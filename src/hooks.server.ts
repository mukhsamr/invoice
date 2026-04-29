import { PUBLIC_PATHS, SESSION_COOKIE } from '$lib/server/constants';
import { ensureSchema, getDb, getUserBySession } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const db = getDb(event.platform);
	await ensureSchema(db);

	const token = event.cookies.get(SESSION_COOKIE);
	event.locals.user = token ? await getUserBySession(db, token) : null;

	const isPublicRoute = PUBLIC_PATHS.some((path) => event.url.pathname.startsWith(path));
	if (!event.locals.user && event.url.pathname.startsWith('/app')) {
		return new Response(null, { status: 303, headers: { location: '/auth/sign-in' } });
	}
	if (event.locals.user && isPublicRoute) {
		return new Response(null, { status: 303, headers: { location: '/app' } });
	}
	return resolve(event);
};
