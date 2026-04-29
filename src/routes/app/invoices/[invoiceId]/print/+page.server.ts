import { error } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth';
import { getBusinessProfile, getDb, getInvoiceById } from '$lib/server/db';

export const load = async ({ locals, platform, params }) => {
	const user = requireUser(locals.user);
	const db = getDb(platform);
	const [invoice, profile] = await Promise.all([getInvoiceById(db, user.id, params.invoiceId), getBusinessProfile(db, user.id)]);
	if (!invoice) throw error(404, 'Invoice not found.');
	return { invoice, profile };
};
