import { fail } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth';
import { createServiceItem, deleteServiceItem, getDb, listServiceItems, updateServiceItem } from '$lib/server/db';

export const load = async ({ locals, platform }) => ({ services: await listServiceItems(getDb(platform), requireUser(locals.user).id) });
export const actions = {
	create: async ({ request, locals, platform }) => { const formData = await request.formData(); if (!String(formData.get('name') ?? '').trim()) return fail(400, { message: 'Service name is required.' }); await createServiceItem(getDb(platform), requireUser(locals.user).id, formData); return { success: true }; },
	update: async ({ request, locals, platform }) => { await updateServiceItem(getDb(platform), requireUser(locals.user).id, await request.formData()); return { success: true }; },
	delete: async ({ request, locals, platform }) => { const formData = await request.formData(); await deleteServiceItem(getDb(platform), requireUser(locals.user).id, String(formData.get('id') ?? '')); return { success: true }; }
};
