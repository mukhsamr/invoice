export function formatCurrency(amount: number, currency = 'IDR') {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency,
		maximumFractionDigits: currency === 'IDR' ? 0 : 2
	}).format(amount || 0);
}
