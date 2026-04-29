import { getBusinessProfile, getDb, getInvoiceMetrics, listCustomers, listInvoices } from '$lib/server/db';
import { requireUser } from '$lib/server/auth';

export const load = async ({ locals, platform }) => {
	const user = requireUser(locals.user);
	const db = getDb(platform);
	const [metrics, invoices, customers, profile] = await Promise.all([getInvoiceMetrics(db, user.id), listInvoices(db, user.id), listCustomers(db, user.id), getBusinessProfile(db, user.id)]);
	return { metrics, recentInvoices: invoices.slice(0, 5), customerCount: customers.length, profile };
};
