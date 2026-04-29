import { error, json } from '@sveltejs/kit';
import { getDb, resetDatabase } from '$lib/server/db';

function ensureLocal(url: URL) {
	if (!['localhost', '127.0.0.1'].includes(url.hostname)) {
		throw error(403, 'Test route is only available locally.');
	}
}

export const POST = async ({ platform, url }) => {
	ensureLocal(url);
	await resetDatabase(getDb(platform));
	return json({ ok: true });
};
