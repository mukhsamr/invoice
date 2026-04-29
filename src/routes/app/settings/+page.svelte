<script lang="ts">let { data } = $props();</script>

<section class="card-elevated no-print p-8">
	<p class="label-md text-primary font-black uppercase tracking-widest">Settings</p>
	<h1 class="headline-lg mt-2 text-black font-black uppercase tracking-tight">Business profile</h1>
</section>

<form method="POST" class="card-elevated grid gap-8 p-8 lg:grid-cols-2">
	<div class="lg:col-span-2">
		<p class="label-md text-primary font-black uppercase tracking-widest">Business identity</p>
		<p class="body-md mt-2 text-zinc-600 font-bold uppercase">These details appear on your invoices and print exports.</p>
	</div>
	<input class="input border-4 border-black font-black uppercase" name="companyName" placeholder="Company name" value={data.profile.companyName} required />
	<input class="input border-4 border-black font-black uppercase" name="companyEmail" type="email" placeholder="Company email" value={data.profile.companyEmail} />
	<input class="input border-4 border-black font-black uppercase" name="companyPhone" placeholder="Company phone" value={data.profile.companyPhone} />
	<input class="input border-4 border-black font-black uppercase" name="invoicePrefix" placeholder="Invoice prefix" value={data.profile.invoicePrefix} />
	<input class="input border-4 border-black font-black uppercase" name="defaultCurrency" placeholder="Default currency" value={data.profile.defaultCurrency} />
	<input class="input border-4 border-black font-black uppercase" name="logoUrl" placeholder="Logo URL" value={data.profile.logoUrl ?? ""} />
	<textarea class="input min-h-28 lg:col-span-2 border-4 border-black font-black uppercase" name="companyAddress" placeholder="Company address">{data.profile.companyAddress}</textarea>
	<textarea class="input min-h-28 lg:col-span-2 border-4 border-black font-black uppercase" name="paymentInstructions" placeholder="Payment instructions">{data.profile.paymentInstructions}</textarea>
	<button class="btn-primary lg:w-max font-black uppercase py-4 px-12" type="submit">Save settings</button>
</form>
