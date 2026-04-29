const baseUrl = process.env.SEED_BASE_URL ?? 'http://127.0.0.1:4173';
const response = await fetch(`${baseUrl}/test/seed-demo`, { method: 'POST' });
if (!response.ok) {
  const text = await response.text();
  console.error(text);
  process.exit(1);
}
console.log(await response.text());
