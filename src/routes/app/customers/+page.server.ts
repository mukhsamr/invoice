import { fail } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth';
import { archiveCustomer, createCustomer, getDb, listCustomers, updateCustomer } from '$lib/server/db';

export const load = async ({ locals, platform, url }) => ({ customers: await listCustomers(getDb(platform), requireUser(locals.user).id, url.searchParams.get('archived') === '1') });

export const actions = {
	create: async ({ request, locals, platform }) => {
		const formData = await request.formData();
		if (!String(formData.get('name') ?? '').trim()) return fail(400, { message: 'Customer name is required.' });
		await createCustomer(getDb(platform), requireUser(locals.user).id, formData);
		return { success: true };
	},
	update: async ({ request, locals, platform }) => { await updateCustomer(getDb(platform), requireUser(locals.user).id, await request.formData()); return { success: true }; },
	archive: async ({ request, locals, platform }) => { const formData = await request.formData(); await archiveCustomer(getDb(platform), requireUser(locals.user).id, String(formData.get('id') ?? '')); return { success: true }; }
};
