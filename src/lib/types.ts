export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'overdue' | 'cancelled';

export type User = {
	id: string;
	email: string;
	name: string;
	createdAt: string;
};

export type BusinessProfile = {
	userId: string;
	companyName: string;
	companyEmail: string;
	companyPhone: string;
	companyAddress: string;
	invoicePrefix: string;
	defaultCurrency: string;
	paymentInstructions: string;
	logoUrl: string | null;
	updatedAt: string;
};

export type Customer = {
	id: string;
	userId: string;
	name: string;
	email: string;
	phone: string;
	company: string;
	address: string;
	notes: string;
	isArchived: number;
	createdAt: string;
	updatedAt: string;
};

export type ServiceItem = {
	id: string;
	userId: string;
	name: string;
	description: string;
	unitPrice: number;
	createdAt: string;
	updatedAt: string;
};

export type Invoice = {
	id: string;
	userId: string;
	customerId: string;
	invoiceNumber: string;
	status: InvoiceStatus;
	issueDate: string;
	dueDate: string;
	currency: string;
	customerName: string;
	customerEmail: string;
	customerAddress: string;
	notes: string;
	paymentInstructions: string;
	subtotal: number;
	discountAmount: number;
	taxPercent: number;
	taxAmount: number;
	totalAmount: number;
	createdAt: string;
	updatedAt: string;
};

export type InvoiceItem = {
	id: string;
	invoiceId: string;
	serviceItemId: string | null;
	name: string;
	description: string;
	quantity: number;
	unitPrice: number;
	lineTotal: number;
	position: number;
};

export type InvoiceWithItems = Invoice & {
	items: InvoiceItem[];
};

export type InvoiceMetrics = {
	totalRevenue: number;
	outstandingRevenue: number;
	paidInvoices: number;
	draftInvoices: number;
	overdueInvoices: number;
};
