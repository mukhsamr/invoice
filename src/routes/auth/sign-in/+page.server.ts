import { fail, redirect } from '@sveltejs/kit';
import { authenticateUser, createSession, ensureSchema, getDb, getUsersCount } from '$lib/server/db';
import { setSessionCookie } from '$lib/server/auth';

export const load = async ({ platform }) => {
	const db = getDb(platform);
	await ensureSchema(db);
	if ((await getUsersCount(db)) === 0) throw redirect(303, '/auth/setup');
	return {};
};

export const actions = {
	default: async ({ request, cookies, platform }) => {
		const formData = await request.formData();
		const user = await authenticateUser(getDb(platform), String(formData.get('email') ?? ''), String(formData.get('password') ?? ''));
		if (!user) return fail(400, { message: 'Invalid email or password.' });
		setSessionCookie(cookies, await createSession(getDb(platform), user.id));
		throw redirect(303, '/app');
	}
};
