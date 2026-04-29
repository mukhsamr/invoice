import { error } from '@sveltejs/kit';
import { hashPassword, verifyPassword } from '$lib/server/auth';
import { calculateInvoiceTotals, normalizeNumber } from '$lib/server/invoices';
import type {
	BusinessProfile,
	Customer,
	Invoice,
	InvoiceItem,
	InvoiceMetrics,
	InvoiceStatus,
	InvoiceWithItems,
	ServiceItem,
	User
} from '$lib/types';

const DEFAULT_PROFILE = {
	companyName: 'Your Company',
	companyEmail: '',
	companyPhone: '',
	companyAddress: '',
	invoicePrefix: 'INV',
	defaultCurrency: 'IDR',
	paymentInstructions: 'Transfer payment and include the invoice number as reference.',
	logoUrl: null
};

const schemaSql = [
	`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL, password_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);`,
	`CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires_at TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);`,
	`CREATE TABLE IF NOT EXISTS business_profiles (user_id TEXT PRIMARY KEY, company_name TEXT NOT NULL, company_email TEXT NOT NULL DEFAULT '', company_phone TEXT NOT NULL DEFAULT '', company_address TEXT NOT NULL DEFAULT '', invoice_prefix TEXT NOT NULL DEFAULT 'INV', default_currency TEXT NOT NULL DEFAULT 'IDR', payment_instructions TEXT NOT NULL DEFAULT '', logo_url TEXT, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);`,
	`CREATE TABLE IF NOT EXISTS customers (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL DEFAULT '', phone TEXT NOT NULL DEFAULT '', company TEXT NOT NULL DEFAULT '', address TEXT NOT NULL DEFAULT '', notes TEXT NOT NULL DEFAULT '', is_archived INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);`,
	`CREATE TABLE IF NOT EXISTS service_items (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', unit_price REAL NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);`,
	`CREATE TABLE IF NOT EXISTS invoices (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, customer_id TEXT NOT NULL, invoice_number TEXT NOT NULL UNIQUE, status TEXT NOT NULL DEFAULT 'draft', issue_date TEXT NOT NULL, due_date TEXT NOT NULL, currency TEXT NOT NULL DEFAULT 'IDR', customer_name TEXT NOT NULL, customer_email TEXT NOT NULL DEFAULT '', customer_address TEXT NOT NULL DEFAULT '', notes TEXT NOT NULL DEFAULT '', payment_instructions TEXT NOT NULL DEFAULT '', subtotal REAL NOT NULL DEFAULT 0, discount_amount REAL NOT NULL DEFAULT 0, tax_percent REAL NOT NULL DEFAULT 0, tax_amount REAL NOT NULL DEFAULT 0, total_amount REAL NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT);`,
	`CREATE TABLE IF NOT EXISTS invoice_items (id TEXT PRIMARY KEY, invoice_id TEXT NOT NULL, service_item_id TEXT, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', quantity REAL NOT NULL DEFAULT 1, unit_price REAL NOT NULL DEFAULT 0, line_total REAL NOT NULL DEFAULT 0, position INTEGER NOT NULL DEFAULT 0, FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE, FOREIGN KEY (service_item_id) REFERENCES service_items(id) ON DELETE SET NULL);`
];

let schemaPromise: Promise<void> | null = null;
type Db = D1Database;

const tableNames = ['invoice_items', 'invoices', 'service_items', 'customers', 'business_profiles', 'sessions', 'users'];

function rowToUser(row: Record<string, unknown>): User {
	return { id: String(row.id), email: String(row.email), name: String(row.name), createdAt: String(row.created_at) };
}

function mapCustomer(row: Record<string, unknown>): Customer {
	return {
		id: String(row.id), userId: String(row.user_id), name: String(row.name), email: String(row.email), phone: String(row.phone), company: String(row.company), address: String(row.address), notes: String(row.notes), isArchived: Number(row.is_archived), createdAt: String(row.created_at), updatedAt: String(row.updated_at)
	};
}

function mapServiceItem(row: Record<string, unknown>): ServiceItem {
	return { id: String(row.id), userId: String(row.user_id), name: String(row.name), description: String(row.description), unitPrice: Number(row.unit_price), createdAt: String(row.created_at), updatedAt: String(row.updated_at) };
}

function mapInvoice(row: Record<string, unknown>): Invoice {
	return {
		id: String(row.id), userId: String(row.user_id), customerId: String(row.customer_id), invoiceNumber: String(row.invoice_number), status: String(row.status) as InvoiceStatus, issueDate: String(row.issue_date), dueDate: String(row.due_date), currency: String(row.currency), customerName: String(row.customer_name), customerEmail: String(row.customer_email), customerAddress: String(row.customer_address), notes: String(row.notes), paymentInstructions: String(row.payment_instructions), subtotal: Number(row.subtotal), discountAmount: Number(row.discount_amount), taxPercent: Number(row.tax_percent), taxAmount: Number(row.tax_amount), totalAmount: Number(row.total_amount), createdAt: String(row.created_at), updatedAt: String(row.updated_at)
	};
}

function mapInvoiceItem(row: Record<string, unknown>): InvoiceItem {
	return { id: String(row.id), invoiceId: String(row.invoice_id), serviceItemId: row.service_item_id ? String(row.service_item_id) : null, name: String(row.name), description: String(row.description), quantity: Number(row.quantity), unitPrice: Number(row.unit_price), lineTotal: Number(row.line_total), position: Number(row.position) };
}

export function getDb(platform: App.Platform | undefined) {
	const db = platform?.env?.DB;
	if (!db) throw error(500, 'Cloudflare D1 binding `DB` is not configured.');
	return db as Db;
}

export async function ensureSchema(db: Db) {
	if (!schemaPromise) {
		schemaPromise = Promise.all(schemaSql.map((statement) => db.exec(statement))).then(() => undefined);
	}
	await schemaPromise;
}

export async function resetDatabase(db: Db) {
	for (const table of tableNames) {
		await db.exec(`DROP TABLE IF EXISTS ${table};`);
	}
	schemaPromise = null;
	await ensureSchema(db);
}

export async function getUsersCount(db: Db) {
	const result = await db.prepare('SELECT COUNT(*) as count FROM users').first<{ count: number }>();
	return Number(result?.count ?? 0);
}

export async function findUserByEmail(db: Db, email: string) {
	return db.prepare('SELECT * FROM users WHERE email = ?').bind(email.toLowerCase()).first<Record<string, unknown>>();
}

export async function createInitialUser(db: Db, input: { email: string; name: string; password: string }) {
	const userId = crypto.randomUUID();
	const now = new Date().toISOString();
	const passwordHash = await hashPassword(input.password);
	await db.prepare('INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)').bind(userId, input.email.toLowerCase(), input.name, passwordHash, now).run();
	await db.prepare('INSERT INTO business_profiles (user_id, company_name, company_email, company_phone, company_address, invoice_prefix, default_currency, payment_instructions, logo_url, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(userId, DEFAULT_PROFILE.companyName, DEFAULT_PROFILE.companyEmail, DEFAULT_PROFILE.companyPhone, DEFAULT_PROFILE.companyAddress, DEFAULT_PROFILE.invoicePrefix, DEFAULT_PROFILE.defaultCurrency, DEFAULT_PROFILE.paymentInstructions, DEFAULT_PROFILE.logoUrl, now).run();
	const row = await findUserByEmail(db, input.email);
	return row ? rowToUser(row) : null;
}

export async function getFirstUser(db: Db) {
	const row = await db.prepare('SELECT id, email, name, created_at FROM users ORDER BY created_at ASC LIMIT 1').first<Record<string, unknown>>();
	return row ? rowToUser(row) : null;
}

export async function createSession(db: Db, userId: string) {
	const token = crypto.randomUUID();
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
	await db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').bind(token, userId, expiresAt).run();
	return token;
}

export async function deleteSession(db: Db, token: string) {
	await db.prepare('DELETE FROM sessions WHERE id = ?').bind(token).run();
}

export async function authenticateUser(db: Db, email: string, password: string) {
	const row = await findUserByEmail(db, email);
	if (!row) return null;
	const isValid = await verifyPassword(password, String(row.password_hash));
	return isValid ? rowToUser(row) : null;
}

export async function getUserBySession(db: Db, token: string) {
	const row = await db.prepare(`SELECT users.id, users.email, users.name, users.created_at FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.id = ? AND sessions.expires_at > ?`).bind(token, new Date().toISOString()).first<Record<string, unknown>>();
	return row ? rowToUser(row) : null;
}

export async function getBusinessProfile(db: Db, userId: string): Promise<BusinessProfile> {
	const row = await db.prepare('SELECT * FROM business_profiles WHERE user_id = ?').bind(userId).first<Record<string, unknown>>();
	if (!row) throw error(404, 'Business profile not found.');
	return { userId: String(row.user_id), companyName: String(row.company_name), companyEmail: String(row.company_email), companyPhone: String(row.company_phone), companyAddress: String(row.company_address), invoicePrefix: String(row.invoice_prefix), defaultCurrency: String(row.default_currency), paymentInstructions: String(row.payment_instructions), logoUrl: row.logo_url ? String(row.logo_url) : null, updatedAt: String(row.updated_at) };
}

export async function updateBusinessProfile(db: Db, userId: string, formData: FormData) {
	await db.prepare(`UPDATE business_profiles SET company_name = ?, company_email = ?, company_phone = ?, company_address = ?, invoice_prefix = ?, default_currency = ?, payment_instructions = ?, logo_url = ?, updated_at = ? WHERE user_id = ?`).bind(String(formData.get('companyName') ?? '').trim(), String(formData.get('companyEmail') ?? '').trim(), String(formData.get('companyPhone') ?? '').trim(), String(formData.get('companyAddress') ?? '').trim(), String(formData.get('invoicePrefix') ?? 'INV').trim().toUpperCase(), String(formData.get('defaultCurrency') ?? 'IDR').trim().toUpperCase(), String(formData.get('paymentInstructions') ?? '').trim(), String(formData.get('logoUrl') ?? '').trim() || null, new Date().toISOString(), userId).run();
}

export async function listCustomers(db: Db, userId: string, includeArchived = false) {
	const result = await db.prepare(includeArchived ? 'SELECT * FROM customers WHERE user_id = ? ORDER BY updated_at DESC' : 'SELECT * FROM customers WHERE user_id = ? AND is_archived = 0 ORDER BY updated_at DESC').bind(userId).all<Record<string, unknown>>();
	return (result.results ?? []).map(mapCustomer);
}

export async function createCustomer(db: Db, userId: string, formData: FormData) {
	const now = new Date().toISOString();
	await db.prepare(`INSERT INTO customers (id, user_id, name, email, phone, company, address, notes, updated_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
		.bind(crypto.randomUUID(), userId, String(formData.get('name') ?? '').trim(), String(formData.get('email') ?? '').trim(), String(formData.get('phone') ?? '').trim(), String(formData.get('company') ?? '').trim(), String(formData.get('address') ?? '').trim(), String(formData.get('notes') ?? '').trim(), now, now).run();
}

export async function updateCustomer(db: Db, userId: string, formData: FormData) {
	await db.prepare(`UPDATE customers SET name = ?, email = ?, phone = ?, company = ?, address = ?, notes = ?, updated_at = ? WHERE id = ? AND user_id = ?`)
		.bind(String(formData.get('name') ?? '').trim(), String(formData.get('email') ?? '').trim(), String(formData.get('phone') ?? '').trim(), String(formData.get('company') ?? '').trim(), String(formData.get('address') ?? '').trim(), String(formData.get('notes') ?? '').trim(), new Date().toISOString(), String(formData.get('id') ?? ''), userId).run();
}

export async function archiveCustomer(db: Db, userId: string, id: string) {
	await db.prepare('UPDATE customers SET is_archived = 1, updated_at = ? WHERE id = ? AND user_id = ?').bind(new Date().toISOString(), id, userId).run();
}

export async function listServiceItems(db: Db, userId: string) {
	const result = await db.prepare('SELECT * FROM service_items WHERE user_id = ? ORDER BY updated_at DESC').bind(userId).all<Record<string, unknown>>();
	return (result.results ?? []).map(mapServiceItem);
}

export async function createServiceItem(db: Db, userId: string, formData: FormData) {
	const now = new Date().toISOString();
	await db.prepare(`INSERT INTO service_items (id, user_id, name, description, unit_price, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`)
		.bind(crypto.randomUUID(), userId, String(formData.get('name') ?? '').trim(), String(formData.get('description') ?? '').trim(), normalizeNumber(formData.get('unitPrice'), 0), now, now).run();
}

export async function updateServiceItem(db: Db, userId: string, formData: FormData) {
	await db.prepare('UPDATE service_items SET name = ?, description = ?, unit_price = ?, updated_at = ? WHERE id = ? AND user_id = ?')
		.bind(String(formData.get('name') ?? '').trim(), String(formData.get('description') ?? '').trim(), normalizeNumber(formData.get('unitPrice'), 0), new Date().toISOString(), String(formData.get('id') ?? ''), userId).run();
}

export async function deleteServiceItem(db: Db, userId: string, id: string) {
	await db.prepare('DELETE FROM service_items WHERE id = ? AND user_id = ?').bind(id, userId).run();
}

export async function nextInvoiceNumber(db: Db, userId: string, prefix: string) {
	const result = await db.prepare('SELECT COUNT(*) as count FROM invoices WHERE user_id = ?').bind(userId).first<{ count: number }>();
	return `${prefix}-${String(Number(result?.count ?? 0) + 1).padStart(4, '0')}`;
}

export async function listInvoices(db: Db, userId: string, search = '') {
	const term = `%${search.trim().toLowerCase()}%`;
	const query = search.trim() ? `SELECT * FROM invoices WHERE user_id = ? AND (LOWER(invoice_number) LIKE ? OR LOWER(customer_name) LIKE ?) ORDER BY issue_date DESC, updated_at DESC` : 'SELECT * FROM invoices WHERE user_id = ? ORDER BY issue_date DESC, updated_at DESC';
	const result = search.trim() ? await db.prepare(query).bind(userId, term, term).all<Record<string, unknown>>() : await db.prepare(query).bind(userId).all<Record<string, unknown>>();
	return (result.results ?? []).map(mapInvoice);
}

export async function getInvoiceById(db: Db, userId: string, invoiceId: string): Promise<InvoiceWithItems | null> {
	const invoiceRow = await db.prepare('SELECT * FROM invoices WHERE id = ? AND user_id = ?').bind(invoiceId, userId).first<Record<string, unknown>>();
	if (!invoiceRow) return null;
	const itemsResult = await db.prepare('SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY position ASC').bind(invoiceId).all<Record<string, unknown>>();
	return { ...mapInvoice(invoiceRow), items: (itemsResult.results ?? []).map(mapInvoiceItem) };
}

export async function createDraftInvoice(db: Db, userId: string) {
	const customers = await listCustomers(db, userId);
	if (customers.length === 0) throw error(400, 'Create a customer before creating an invoice.');
	const profile = await getBusinessProfile(db, userId);
	const customer = customers[0];
	const now = new Date().toISOString();
	const invoiceId = crypto.randomUUID();
	const issueDate = new Date().toISOString().slice(0, 10);
	const dueDate = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
	await db.prepare(`INSERT INTO invoices (id, user_id, customer_id, invoice_number, status, issue_date, due_date, currency, customer_name, customer_email, customer_address, notes, payment_instructions, subtotal, discount_amount, tax_percent, tax_amount, total_amount, created_at, updated_at) VALUES (?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 0, ?, ?)`).bind(invoiceId, userId, customer.id, await nextInvoiceNumber(db, userId, profile.invoicePrefix), issueDate, dueDate, profile.defaultCurrency, customer.name, customer.email, customer.address, '', profile.paymentInstructions, now, now).run();
	await db.prepare(`INSERT INTO invoice_items (id, invoice_id, service_item_id, name, description, quantity, unit_price, line_total, position) VALUES (?, ?, NULL, ?, ?, 1, 0, 0, 0)`).bind(crypto.randomUUID(), invoiceId, 'Initial service', 'Describe the work delivered').run();
	return invoiceId;
}

export async function saveInvoice(db: Db, userId: string, invoiceId: string, formData: FormData) {
	const customer = await db.prepare('SELECT * FROM customers WHERE id = ? AND user_id = ?').bind(String(formData.get('customerId') ?? ''), userId).first<Record<string, unknown>>();
	if (!customer) throw error(400, 'Customer not found.');
	const rawItems = JSON.parse(String(formData.get('items') ?? '[]')) as Array<Record<string, unknown>>;
	const items: InvoiceItem[] = rawItems.filter((item) => String(item.name ?? '').trim().length > 0).map((item, position) => {
		const quantity = normalizeNumber(String(item.quantity ?? 1), 1);
		const unitPrice = normalizeNumber(String(item.unitPrice ?? 0), 0);
		return { id: String(item.id ?? crypto.randomUUID()), invoiceId, serviceItemId: item.serviceItemId ? String(item.serviceItemId) : null, name: String(item.name ?? '').trim(), description: String(item.description ?? '').trim(), quantity, unitPrice, lineTotal: quantity * unitPrice, position };
	});
	const totals = calculateInvoiceTotals(items, normalizeNumber(formData.get('discountAmount'), 0), normalizeNumber(formData.get('taxPercent'), 0));
	await db.prepare(`UPDATE invoices SET customer_id = ?, invoice_number = ?, status = ?, issue_date = ?, due_date = ?, currency = ?, customer_name = ?, customer_email = ?, customer_address = ?, notes = ?, payment_instructions = ?, subtotal = ?, discount_amount = ?, tax_percent = ?, tax_amount = ?, total_amount = ?, updated_at = ? WHERE id = ? AND user_id = ?`).bind(String(customer.id), String(formData.get('invoiceNumber') ?? '').trim(), String(formData.get('status') ?? 'draft'), String(formData.get('issueDate') ?? ''), String(formData.get('dueDate') ?? ''), String(formData.get('currency') ?? 'IDR'), String(customer.name), String(customer.email), String(customer.address), String(formData.get('notes') ?? '').trim(), String(formData.get('paymentInstructions') ?? '').trim(), totals.subtotal, totals.discountAmount, totals.taxPercent, totals.taxAmount, totals.totalAmount, new Date().toISOString(), invoiceId, userId).run();
	await db.prepare('DELETE FROM invoice_items WHERE invoice_id = ?').bind(invoiceId).run();
	for (const item of items) {
		await db.prepare(`INSERT INTO invoice_items (id, invoice_id, service_item_id, name, description, quantity, unit_price, line_total, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(item.id, invoiceId, item.serviceItemId, item.name, item.description, item.quantity, item.unitPrice, item.lineTotal, item.position).run();
	}
	return totals;
}

export async function deleteInvoice(db: Db, userId: string, invoiceId: string) {
	await db.prepare('DELETE FROM invoices WHERE id = ? AND user_id = ?').bind(invoiceId, userId).run();
}

export async function duplicateInvoice(db: Db, userId: string, invoiceId: string) {
	const existing = await getInvoiceById(db, userId, invoiceId);
	if (!existing) throw error(404, 'Invoice not found.');
	const profile = await getBusinessProfile(db, userId);
	const newId = crypto.randomUUID();
	const now = new Date().toISOString();
	await db.prepare(`INSERT INTO invoices (id, user_id, customer_id, invoice_number, status, issue_date, due_date, currency, customer_name, customer_email, customer_address, notes, payment_instructions, subtotal, discount_amount, tax_percent, tax_amount, total_amount, created_at, updated_at) VALUES (?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(newId, userId, existing.customerId, await nextInvoiceNumber(db, userId, profile.invoicePrefix), existing.issueDate, existing.dueDate, existing.currency, existing.customerName, existing.customerEmail, existing.customerAddress, existing.notes, existing.paymentInstructions, existing.subtotal, existing.discountAmount, existing.taxPercent, existing.taxAmount, existing.totalAmount, now, now).run();
	for (const item of existing.items) {
		await db.prepare(`INSERT INTO invoice_items (id, invoice_id, service_item_id, name, description, quantity, unit_price, line_total, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(crypto.randomUUID(), newId, item.serviceItemId, item.name, item.description, item.quantity, item.unitPrice, item.lineTotal, item.position).run();
	}
	return newId;
}

export async function getInvoiceMetrics(db: Db, userId: string): Promise<InvoiceMetrics> {
	const result = await db.prepare(`SELECT COALESCE(SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END), 0) as total_revenue, COALESCE(SUM(CASE WHEN status IN ('issued', 'overdue') THEN total_amount ELSE 0 END), 0) as outstanding_revenue, SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_invoices, SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_invoices, SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) as overdue_invoices FROM invoices WHERE user_id = ?`).bind(userId).first<Record<string, unknown>>();
	return { totalRevenue: Number(result?.total_revenue ?? 0), outstandingRevenue: Number(result?.outstanding_revenue ?? 0), paidInvoices: Number(result?.paid_invoices ?? 0), draftInvoices: Number(result?.draft_invoices ?? 0), overdueInvoices: Number(result?.overdue_invoices ?? 0) };
}

export async function seedDemoWorkspace(db: Db, userId: string) {
	const now = new Date().toISOString();
	const existingCustomers = await listCustomers(db, userId, true);
	if (existingCustomers.length > 0) {
		return { seeded: false, reason: 'Demo data already exists.' };
	}

	const profile = await getBusinessProfile(db, userId);
	const customerId = crypto.randomUUID();
	const serviceId = crypto.randomUUID();
	const invoiceId = crypto.randomUUID();
	const invoiceNumber = await nextInvoiceNumber(db, userId, profile.invoicePrefix);
	const issueDate = new Date().toISOString().slice(0, 10);
	const dueDate = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

	await db.prepare(`INSERT INTO customers (id, user_id, name, email, phone, company, address, notes, is_archived, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`)
		.bind(customerId, userId, 'Acme Creative', 'billing@acme.test', '+62 812 0000 0000', 'Acme Creative', 'Jakarta, Indonesia', 'Demo customer for manual QA', now, now).run();

	await db.prepare(`INSERT INTO service_items (id, user_id, name, description, unit_price, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`)
		.bind(serviceId, userId, 'Website Design Sprint', 'Landing page design and revisions', 2500000, now, now).run();

	await db.prepare(`INSERT INTO invoices (id, user_id, customer_id, invoice_number, status, issue_date, due_date, currency, customer_name, customer_email, customer_address, notes, payment_instructions, subtotal, discount_amount, tax_percent, tax_amount, total_amount, created_at, updated_at) VALUES (?, ?, ?, ?, 'issued', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
		.bind(invoiceId, userId, customerId, invoiceNumber, issueDate, dueDate, profile.defaultCurrency, 'Acme Creative', 'billing@acme.test', 'Jakarta, Indonesia', 'Demo invoice for preview.', profile.paymentInstructions, 2500000, 0, 11, 275000, 2775000, now, now).run();

	await db.prepare(`INSERT INTO invoice_items (id, invoice_id, service_item_id, name, description, quantity, unit_price, line_total, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
		.bind(crypto.randomUUID(), invoiceId, serviceId, 'Website Design Sprint', 'Landing page design and revisions', 1, 2500000, 2500000, 0).run();

	return { seeded: true, reason: null };
}
