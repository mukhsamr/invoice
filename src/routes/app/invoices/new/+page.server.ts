import { redirect } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth';
import { createDraftInvoice, getDb } from '$lib/server/db';

export const load = async ({ locals, platform }) => {
	throw redirect(303, `/app/invoices/${await createDraftInvoice(getDb(platform), requireUser(locals.user).id)}`);
};
