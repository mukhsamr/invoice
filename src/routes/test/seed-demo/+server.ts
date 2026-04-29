import { error, json } from '@sveltejs/kit';
import { getDb, getFirstUser, seedDemoWorkspace } from '$lib/server/db';

function ensureLocal(url: URL) {
	if (!['localhost', '127.0.0.1'].includes(url.hostname)) {
		throw error(403, 'Test route is only available locally.');
	}
}

export const POST = async ({ platform, url }) => {
	ensureLocal(url);
	const db = getDb(platform);
	const user = await getFirstUser(db);
	if (!user) {
		throw error(400, 'Create an owner account first.');
	}

	const result = await seedDemoWorkspace(db, user.id);
	return json({ ok: true, ...result });
};
