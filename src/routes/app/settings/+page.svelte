<script lang="ts">let { data } = $props();</script>

<section class="card-elevated no-print p-8">
	<p class="label-md text-primary">Settings</p>
	<h1 class="headline-lg mt-2 text-on-surface">Business profile & defaults</h1>
</section>

<form method="POST" class="card-elevated grid gap-6 p-8 lg:grid-cols-2">
	<div class="lg:col-span-2">
		<p class="label-md text-primary">Business identity</p>
		<p class="body-md mt-2 text-on-surface-variant">These details appear on your invoices and print exports.</p>
	</div>
	<input class="input" name="companyName" placeholder="Company name" value={data.profile.companyName} required />
	<input class="input" name="companyEmail" type="email" placeholder="Company email" value={data.profile.companyEmail} />
	<input class="input" name="companyPhone" placeholder="Company phone" value={data.profile.companyPhone} />
	<input class="input" name="invoicePrefix" placeholder="Invoice prefix" value={data.profile.invoicePrefix} />
	<input class="input" name="defaultCurrency" placeholder="Default currency" value={data.profile.defaultCurrency} />
	<input class="input" name="logoUrl" placeholder="Logo URL" value={data.profile.logoUrl ?? ""} />
	<textarea class="input min-h-28 lg:col-span-2" name="companyAddress" placeholder="Company address">{data.profile.companyAddress}</textarea>
	<textarea class="input min-h-28 lg:col-span-2" name="paymentInstructions" placeholder="Payment instructions">{data.profile.paymentInstructions}</textarea>
	<button class="btn-primary lg:w-max" type="submit">Save settings</button>
</form>
