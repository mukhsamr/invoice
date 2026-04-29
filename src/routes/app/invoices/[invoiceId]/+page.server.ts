import { error } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth';
import { getDb, getInvoiceById, listCustomers, listServiceItems, saveInvoice } from '$lib/server/db';

export const load = async ({ locals, platform, params }) => {
	const user = requireUser(locals.user);
	const db = getDb(platform);
	const [invoice, customers, services] = await Promise.all([getInvoiceById(db, user.id, params.invoiceId), listCustomers(db, user.id), listServiceItems(db, user.id)]);
	if (!invoice) throw error(404, 'Invoice not found.');
	return { invoice, customers, services };
};

export const actions = { default: async ({ request, locals, platform, params }) => { await saveInvoice(getDb(platform), requireUser(locals.user).id, params.invoiceId, await request.formData()); return { success: true }; } };
