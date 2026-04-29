import { redirect } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth';
import { createDraftInvoice, deleteInvoice, duplicateInvoice, getDb, listInvoices } from '$lib/server/db';

export const load = async ({ locals, platform, url }) => ({ invoices: await listInvoices(getDb(platform), requireUser(locals.user).id, url.searchParams.get('q') ?? ''), query: url.searchParams.get('q') ?? '' });
export const actions = {
	create: async ({ locals, platform }) => { throw redirect(303, `/app/invoices/${await createDraftInvoice(getDb(platform), requireUser(locals.user).id)}`); },
	delete: async ({ request, locals, platform }) => { const formData = await request.formData(); await deleteInvoice(getDb(platform), requireUser(locals.user).id, String(formData.get('id') ?? '')); return { success: true }; },
	duplicate: async ({ request, locals, platform }) => { const formData = await request.formData(); throw redirect(303, `/app/invoices/${await duplicateInvoice(getDb(platform), requireUser(locals.user).id, String(formData.get('id') ?? ''))}`); }
};
