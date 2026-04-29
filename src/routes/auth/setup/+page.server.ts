import { fail, redirect } from '@sveltejs/kit';
import { createInitialUser, createSession, ensureSchema, getDb, getUsersCount } from '$lib/server/db';
import { setSessionCookie } from '$lib/server/auth';

export const load = async ({ platform }) => {
	const db = getDb(platform);
	await ensureSchema(db);
	if ((await getUsersCount(db)) > 0) throw redirect(303, '/auth/sign-in');
	return {};
};

export const actions = {
	default: async ({ request, cookies, platform }) => {
		const db = getDb(platform);
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();
		const email = String(formData.get('email') ?? '').trim().toLowerCase();
		const password = String(formData.get('password') ?? '');
		if (!name || !email || password.length < 8) return fail(400, { message: 'Name, email, and an 8-character password are required.' });
		const user = await createInitialUser(db, { name, email, password });
		if (!user) return fail(500, { message: 'Unable to create the first account.' });
		setSessionCookie(cookies, await createSession(db, user.id));
		throw redirect(303, '/app');
	}
};
