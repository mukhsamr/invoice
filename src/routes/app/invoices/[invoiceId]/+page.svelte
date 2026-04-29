<script lang="ts">import InvoiceEditor from '$lib/components/InvoiceEditor.svelte'; let { data } = $props();</script>
<InvoiceEditor invoice={data.invoice} customers={data.customers} services={data.services} />
